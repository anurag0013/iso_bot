import { Test, TestingModule } from '@nestjs/testing';
import { ChatGateway } from './chat.gateway';
import { LangchainService } from '../langchain/langchain.service';
import { ChatService } from './chat.service';

describe('ChatGateway', () => {
    let chatGateway: ChatGateway;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ChatGateway,
                {
                    provide: LangchainService,
                    useValue: {},
                },
                {
                    provide:ChatService,
                    useValue: {}
                }
            ],
        }).compile();

        chatGateway = module.get<ChatGateway>(ChatGateway);
    });

    it('should be defined', () => {
        expect(chatGateway).toBeDefined();
    });

});
