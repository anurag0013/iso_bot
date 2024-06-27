import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ConfigurationService {
    private port: number;
    private jwtSecret: string;
    private developerEmail: string;
    private databaseUrl: string;
    private openAiApiKey: string;
    private chatModelName: string;
    private embeddingModel: string;
    private targetSourceChunks: number;
    private connectInfinityServerConnectionString: string;
    private vectorstoreCollectionName: string;
    private vectorstoreURL: string;

    constructor(private readonly configService: ConfigService) {
        const port = this.configService.get<number>('port');
        const socketPort = this.configService.get<number>('socketPort');
        const jwtSecret = this.configService.get<string>('jwtSecret');
        const databaseUrl = this.configService.get<string>('database.host');
        const openAiKey = this.configService.get<string>('openAiApiKey');
        const embeddingModel = this.configService.get<string>('embeddingModel');
        const targetSourceChunks =
            this.configService.get<number>('targetSourceChunks') || 6;
        const chatModelName = this.configService.get<string>('chatModelName');
        const connectInfinityServerConnectionString =
            this.configService.get<string>(
                'connectInfinityServerConnectionString',
            );
        const developerEmail = this.configService.get<string>('developerEmail');
        const vectorstoreCollectionName =  this.configService.get<string>('vectorstoreCollectionName');
        const vectorstoreURL = this.configService.get<string>('vectorstoreURL');

        if (
            !port ||
            !socketPort ||
            !databaseUrl ||
            !openAiKey ||
            !chatModelName ||
            !connectInfinityServerConnectionString||
            !vectorstoreCollectionName||
            !vectorstoreURL
        ) {
            throw new Error(`Environment variables are missing`);
        }

        this.port = port;
        this.databaseUrl = databaseUrl;
        this.jwtSecret = jwtSecret;
        this.openAiApiKey = openAiKey;
        this.embeddingModel = embeddingModel;
        this.targetSourceChunks = targetSourceChunks;
        this.chatModelName = chatModelName;
        this.connectInfinityServerConnectionString =
            connectInfinityServerConnectionString;
        this.developerEmail = developerEmail;
        this.vectorstoreCollectionName = vectorstoreCollectionName;
        this.vectorstoreURL = vectorstoreURL;
    }

    getPort(): number {
        return this.port;
    }

    getJwtSecret(): string {
        return this.jwtSecret;
    }

    getDeveloperEmail(): string[] {
        return this.developerEmail.split(',');
    }

    getDatabaseUrl(): string {
        return this.databaseUrl;
    }

    getOpenAiApiKey(): string {
        return this.openAiApiKey;
    }

    getEmbeddingModel(): string {
        return this.embeddingModel;
    }

    getTargetSourceChunks(): number | null {
        return this.targetSourceChunks;
    }

    getChatModelName(): string {
        return this.chatModelName;
    }

    getConnectInfinityServerConnectionString(): string {
        return this.connectInfinityServerConnectionString;
    }

    getVectorStoreColllectionName(): string{
        return this.vectorstoreCollectionName;
    }

    getVectorStoreURL(): string{
        return this.vectorstoreURL;
    }
}
