import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Balance, BalanceDocument, BalanceSchema } from './schema/balance.schema'; 
import { CreateBalanceDTO } from './dto/create-balance.dto';
import { Model } from 'mongoose';

@Injectable()
export class BalanceService {
  constructor(
    @InjectModel(Balance.name) private readonly balanceModel: Model<Balance>
  ) {}

  async findByName(number: string): Promise<any> {
    console.log("number in service: ",number)
      return await this.balanceModel
        .find()
        .exec();
  }
}
