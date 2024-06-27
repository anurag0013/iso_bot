import { Module } from '@nestjs/common';
import { LangchainService } from './langchain.service';
import { ConfigurationModule } from '../configuration/configuration.module';

@Module({
    providers: [LangchainService],
    exports: [LangchainService],
    imports: [ConfigurationModule]
})
export class LangchainModule {}
