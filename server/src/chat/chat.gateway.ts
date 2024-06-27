import { LangchainService } from '../langchain/langchain.service';
import {
    ConnectedSocket,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway(Number(process.env.SOCKET_PORT), {
    cors: {
        origin: '*',
        allowedHeaders: '*',
    },
})
export class ChatGateway {
    @WebSocketServer()
    server: Server;

    constructor(
        private langchainService: LangchainService,
        private chatService: ChatService,
    ) {}

    @SubscribeMessage('question')
    async chat(@MessageBody() query, @ConnectedSocket() client: Socket) {

        //first authenticate the user
        const user = await this.chatService.getUserFromSocket(client);

        const answer = await this.langchainService.getAnswer(query, user.name, client);
        
        await this.chatService.saveChat(
            user._id,
            client.id,
            query,
            answer,
        );
    }
}
