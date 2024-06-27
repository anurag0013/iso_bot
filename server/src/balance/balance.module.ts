import { Module } from '@nestjs/common';
import { BalanceService } from './balance.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Balance, BalanceSchema } from './schema/balance.schema';
import { BalanceController } from './balance.controller';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Balance.name, schema: BalanceSchema }]),
    ],
    providers: [BalanceService],
    controllers: [BalanceController],
    exports: [BalanceService],
})
export class BalanceModule {}
