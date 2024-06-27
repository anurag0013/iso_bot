import { Test, TestingModule } from '@nestjs/testing';
import { LangchainService } from './langchain.service';
import { ConfigurationModule } from '../configuration/configuration.module';

describe('LangchainService', () => {
  let service: LangchainService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LangchainService],
      imports: [ConfigurationModule]
    }).compile();

    service = module.get<LangchainService>(LangchainService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
