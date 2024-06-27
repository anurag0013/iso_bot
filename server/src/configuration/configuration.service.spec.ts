import { Test, TestingModule } from '@nestjs/testing';
import { ConfigurationService } from './configuration.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './configuration';

describe('ConfigurationService', () => {
    let configurationService: ConfigurationService;
    let configService: ConfigService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    isGlobal: true,
                    load: [configuration],
                }),
            ],
            providers: [ConfigurationService],
        }).compile();

        configurationService =
            module.get<ConfigurationService>(ConfigurationService);
        configService = module.get<ConfigService>(ConfigService);
    });

    it('should be defined', () => {
        expect(configurationService).toBeDefined();
    });

    it('should return port', () => {
        const port = configurationService.getPort();

        expect(port).toEqual(configService.get('port'));
    });

    it('should return jwt key', () => {
        const jwtSecret = configurationService.getJwtSecret();

        expect(jwtSecret).toEqual(configService.get('jwtSecret'));
    });

    it('should return database url', () => {
        const databaseUrl = configurationService.getDatabaseUrl();

        expect(databaseUrl).toEqual(configService.get('database.host'));
    });

    it('should return openai api key', () => {
        const openAiApiKey = configurationService.getOpenAiApiKey();

        expect(openAiApiKey).toEqual(configService.get('openAiApiKey'));
    });

    it('should return embedding model', () => {
        const embeddingModel = configurationService.getEmbeddingModel();

        expect(embeddingModel).toEqual(configService.get('embeddingModel'));
    });

    it('should return persist directory', () => {
        const persistDirectory = configurationService.getPersistDirectory();

        expect(persistDirectory).toEqual(configService.get('persistDirectory'));
    });

    it('should return target source chunks', () => {
        const targetSourceChunks = configurationService.getTargetSourceChunks();

        expect(targetSourceChunks).toEqual(
            configService.get('targetSourceChunks'),
        );
    });

    it('should return chat model name', () => {
        const chatModelName = configurationService.getChatModelName();

        expect(chatModelName).toEqual(configService.get('chatModelName'));
    });

    it('should return connect infinity server connection string', () => {
        const connectInfinityServerConnectionString =
            configurationService.getConnectInfinityServerConnectionString();

        expect(connectInfinityServerConnectionString).toEqual(
            configService.get('connectInfinityServerConnectionString'),
        );
    });
});
