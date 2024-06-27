import { Injectable, Search } from '@nestjs/common';
import { ConfigurationService } from '../configuration/configuration.service';
import { Socket } from 'socket.io';
import { AIMessage, HumanMessage } from 'langchain/schema';
import { BalanceService } from 'src/balance/balance.service';
import { CreateBalanceDTO } from 'src/balance/dto/create-balance.dto';
import { User } from 'src/user/schema/user.schema';


@Injectable()
export class LangchainService {
    private openAiApiKey: string;
    private embeddingModel: string;
    private targetSourceChunks: number;
    private chatModelName: string;
    private chatHistory: Array<HumanMessage | AIMessage> = [];
    private readonly balanceService: BalanceService
    private greetingAnswers: Array<string> = [
        'Welcome to ISO. How may I help you?',
        'Hello! Welcome to ISO. How may I help you today?',
        'Hello! How can I assist you today?',
        'Hello! How may I help you?',
    ];

    private greetingQuestions: Array<string> = [
        'hi',
        'hello',
        'namaste',
        'namaskar',
        'good morning',
        'good evening',
    ];

    constructor(private readonly configurationService: ConfigurationService) {
        this.openAiApiKey = configurationService.getOpenAiApiKey();
        this.embeddingModel = configurationService.getEmbeddingModel();
        this.targetSourceChunks =
            configurationService.getTargetSourceChunks() || 4;
        this.chatModelName = configurationService.getChatModelName();
    }

    systemTemplate(): string {
        const systemTemplate = `
            You are a chatbot designed to answer queries related to ISO standard specifically the ISO 27001.
            The documentation of the standard is provided in the context below.
            Context is wrapped by <context></context>.
            You are strictly advised not add up knowledge outside the context.
            You should respond exactly with what is written in the context you are provided.
            If you do not get the content in the context say, "Sorry! I am unable to process this request at the moment."
        `;
        return systemTemplate;
    }

    // You are chatbot, you job is to answer to the questions regarding iso which is provided in the context and the context is wrapped by <context></context>.
    //                             Do not use any facts or knowledge outside the context.
    //                             If you don't know the answer, simple replied with I'm sorry, I don't have any information.
    
    // Use exact same word provided in context to answer every query.

    RETRIEVER_PREFIX = "<retriever>"
    LM_PREFIX = "<lm>"
    
    async getAnswer(
        query: string,
        username:string,
        client: Socket,
    ): Promise<any> {
        const { OpenAIEmbeddings } = await import(
            'langchain/embeddings/openai'
        );
        const { Chroma } = await import('langchain/vectorstores/chroma');
        const { ChatOpenAI } = await import('langchain/chat_models/openai');

        const {
            HumanMessagePromptTemplate,
            ChatPromptTemplate,
            SystemMessagePromptTemplate,
            MessagesPlaceholder,
        } = await import('langchain/prompts');
        const { PromptTemplate } = await import('langchain/prompts');

        const { ConversationalRetrievalQAChain } = await import(
            'langchain/chains'
        );

        const { BufferWindowMemory } = await import('langchain/memory');
        const { ChatMessageHistory } = await import('langchain/memory');
        const { basename } = await import('path');

        if (this.greetingQuestions.includes(query.toLowerCase())) {
            let result =
                this.greetingAnswers[
                    Math.floor(Math.random() * this.greetingAnswers.length)
                ];
            client.emit('answer', result);
            return result;
        }

        const embeddings = new OpenAIEmbeddings({
            openAIApiKey: this.openAiApiKey,
            modelName: this.embeddingModel,
        });

        const vectorstore = await Chroma.fromExistingCollection(embeddings, {
            collectionName:
                this.configurationService.getVectorStoreColllectionName(),
            url: this.configurationService.getVectorStoreURL(),
            
        });
        
        const retriever = vectorstore.asRetriever({
            // k: this.targetSourceChunks,
            // searchType:"similarity" 
            
            // searchType:"similarity",
            // searchKwargs:{"lambda":0.85},
            
            searchKwargs: {
                fetchK: this.targetSourceChunks,
                lambda: 0.80,
            },
            
            
        });
        
        const llm = new ChatOpenAI({
            streaming: true,
            modelName: this.chatModelName,
            openAIApiKey: this.openAiApiKey,
            temperature: 0.1,
            verbose:true
        });

        const promptTemplate = await PromptTemplate.fromTemplate(
            this.systemTemplate(),
        ).format({user:username});

        const prompt = ChatPromptTemplate.fromMessages([
            SystemMessagePromptTemplate.fromTemplate(promptTemplate),
            SystemMessagePromptTemplate.fromTemplate(
                `${this.RETRIEVER_PREFIX}<chatHistory>{{chat_history}}</chatHistory>${this.LM_PREFIX}`,
            ),
            SystemMessagePromptTemplate.fromTemplate(
                `${this.RETRIEVER_PREFIX}<context>{{context}}</context>${this.LM_PREFIX}`,
            ),
            HumanMessagePromptTemplate.fromTemplate('{question}'),
        ]);

        const memory = new BufferWindowMemory({
            returnMessages: true,
            memoryKey: 'chat_history',
            inputKey: 'question',
            outputKey: 'text',
            chatHistory: new ChatMessageHistory(this.chatHistory),
            k: 5,
        });

        const chain = ConversationalRetrievalQAChain.fromLLM(llm, retriever, {
            outputKey: 'text',
            memory: memory,
            returnSourceDocuments:true,
            qaChainOptions: {
                type: 'map_reduce',
                /* these params are for type refine */ 
                // questionPrompt:prompt,
                // refinePrompt: prompt,
                // refineLLM: llm,
            
                /* these params are for type map_reduce */ 
                combineMapPrompt:prompt,
                combinePrompt:prompt,
                combineLLM:llm,
                verbose: true,
                
                /* this is used with stuff type */ 
                // prompt: prompt,
            },
            questionGeneratorChainOptions: {
                llm: new ChatOpenAI({
                    temperature: 0.1,
                    modelName: this.configurationService.getChatModelName(),
                }),
            },
            verbose: true,
        });

        const result = await chain.call(
            {
                question: query,
            },
            {
                callbacks: [
                    {
                        handleLLMNewToken(_token: string) {
                            // client.emit('answer', token, __filename);
                        },
                    },
                ],
            },
        );

        // Check if there are source documents and include their file names if available
        let finalResult = result['text'];
        if (result.sourceDocuments && result.sourceDocuments.length > 0) {
            const fileNames = result.sourceDocuments.map((doc) => basename(doc.metadata.source));
            finalResult += ` (Sources: ${fileNames.join(', ')})`;
        }
        
        finalResult = finalResult.replace(new RegExp(this.RETRIEVER_PREFIX, 'g'), 'Retrieved: ').replace(new RegExp(this.LM_PREFIX, 'g'), 'Language Model: ');
    
        this.chatHistory.push(
            new HumanMessage(query),
            new AIMessage(result['text']),
        );
        client.emit('answer', finalResult);
        return result['text'];
        // return finalResult;
    }

//     async getUserData(number: string) {
//         const user = await this.balanceService.findByName(number);
//         console.log("check this ",user);
//         if (user) {
//           console.log("Name:", user.name);
//           console.log("Balance:", user.balance);
//         } else {
//           console.log("No user found with that number hehe");
//         }
//     }
    
}
