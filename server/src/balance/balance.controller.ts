import { Body, Controller, Get, Param, Query } from '@nestjs/common';
import { BalanceService } from './balance.service';
import { CreateBalanceDTO } from './dto/create-balance.dto';

@Controller('balance')
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @Get('number')
  async getUserData(@Body('number') number) {
    const user = await this.balanceService.findByName(number);
    console.log("number:",number)
    console.log("user:",user)
    if (user) {
      return user; 
    } else {
      return { message: 'No user found with that number' }; 
    }
  }
}
