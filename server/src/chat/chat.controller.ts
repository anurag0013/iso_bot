import {
    Controller,
    Param,
    Get,
    Headers,
    ForbiddenException,
    BadRequestException,
} from '@nestjs/common';
import { Chat } from './schema/chat.schema';
import { ChatService } from './chat.service';
import { ConfigurationService } from '../configuration/configuration.service';

@Controller('chat')
export class ChatController {
    constructor(
        private chatService: ChatService,
        private configurationService: ConfigurationService,
    ) {}

    @Get(':session_id')
    async getUserChat(
        @Param('session_id') sessionId: string,
        @Headers() headers: Record<string, string>,
    ): Promise<Chat | BadRequestException | ForbiddenException | Object> {
        // first check if the custom header exists
        let customHeader = headers['chatbot-to-connect-infinity-token'];
        if (!customHeader) {
            throw new ForbiddenException();
        }
        // if the header exists, check the authenticity of the header
        let tokenHeader = customHeader.split(' ')[0];
        let token = customHeader.split(' ')[1];

        if (
            this.configurationService.getConnectInfinityServerConnectionString() ===
                token &&
            tokenHeader === 'CHATBOT_SERVER_TO_CONNECT_INFINITY'
        ) {
            return await this.chatService.getChatFromSession(sessionId);
        }
        throw new BadRequestException();
    }
}
