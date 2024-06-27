import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import  { HydratedDocument, Types } from 'mongoose';

export type BalanceDocument = HydratedDocument<Balance>;

@Schema()
export class Balance {
  _id: Types.ObjectId;

  @Prop({required:true, unique:true})
  number: string;

  @Prop()
  name: string;

  @Prop()
  balance: string; // Consider using number for monetary values
}

export const BalanceSchema = SchemaFactory.createForClass(Balance);
