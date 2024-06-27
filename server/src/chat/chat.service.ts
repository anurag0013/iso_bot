import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { InjectModel } from '@nestjs/mongoose';
import { Chat } from './schema/chat.schema';
import mongoose, { Model } from 'mongoose';
import { User } from '../user/schema/user.schema';

@Injectable()
export class ChatService {
    constructor(
        @InjectModel(Chat.name) private readonly chatModel: Model<Chat>,
        private authService: AuthService,
    ) {}

    async findChat(
        user_id: mongoose.Types.ObjectId,
        session_id: string,
    ): Promise<Chat> {
        return await this.chatModel
            .findOne({
                user_id: user_id,
                session_id: session_id,
            })
            .exec();
    }

    async saveChat(
        user_id: mongoose.Types.ObjectId,
        session_id: string,
        question: string,
        answer: string,
    ): Promise<Chat> {
        const findChat = await this.findChat(user_id, session_id);
        if (findChat) {
            return await this.chatModel
                .findOneAndUpdate(
                    { _id: findChat._id },
                    {
                        $push: {
                            'chats.questions': question,
                            'chats.answers': answer,
                        },
                    },
                )
                .exec();
        } else {
            return await this.chatModel.create({
                user_id: user_id,
                session_id: session_id,
                chats: { questions: question, answers: answer },
            });
        }
    }

    async getChatFromSession(sessionId: string): Promise<Chat | Object> {

        try{
            return await this.chatModel.findOne({ session_id: sessionId }).exec();
        }
        catch(error){
            return {"msg":"Error Occured", error:true}
        }
    }

    async getUserFromSocket(socket: Socket): Promise<User> {
        let auth_token = socket.handshake.auth['token'];
        // get the token itself without "Bearer"
        auth_token = auth_token.split(' ')[1];

        const user =
            this.authService.getUserFromAuthenticationToken(auth_token);

        if (!user) {
            throw new WsException('Invalid credentials.');
        }

        return user;
    }
}
