import { HydratedDocument, ObjectId, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { ChatInteface } from '../../chat/interface/chat.interface';

export type ChatDocument = HydratedDocument<Chat>;

@Schema({ timestamps: true })
export class Chat {
    _id: Types.ObjectId;
    @Prop({ required: true, type: Types.ObjectId })
    user_id: Types.ObjectId;

    // the session id is provided from the socket id
    @Prop({ required: true, unique: true })
    session_id: string;

    @Prop(
        raw({
            questions: { type: [String] },
            answers: { type: [String] },
        }),
    )
    chats: ChatInteface<any>;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
