import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
    
    _id: Types.ObjectId;
    @Prop({ required: true, unique: true })
    name: string;

    @Prop()
    access_token: string;
}

export const UserSchema = SchemaFactory.createForClass(User);


