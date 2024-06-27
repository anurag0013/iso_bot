import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { AuthModule } from '../auth/auth.module';
import { LangchainModule } from '../langchain/langchain.module';
import { ChatGateway } from './chat.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from './schema/chat.schema';
import { ConfigurationModule } from '../configuration/configuration.module';

@Module({
  imports: [
    LangchainModule,
    AuthModule,
    ConfigurationModule,
    MongooseModule.forFeature([{name: Chat.name, schema:ChatSchema}])
  ],
  controllers: [ChatController],
  providers: [ChatService,ChatGateway],
  exports: [ChatService, ChatGateway]
  
})
export class ChatModule {}
