import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TransactionDto } from './dtos/transaction.dto';
import { TransactionService } from './transation.service';

@Controller()
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('api/transactions')
  async createTransaction(@Body() transactionDto: TransactionDto) {
    await this.transactionService.emitTransaction(transactionDto);
    return 'Transaction emitted successfully';
  }
  @Get('api/transactions/:TRANSACTION_ID')
  async verifyTransaction(@Param('TRANSACTION_ID') transactionId: string) {
    return {blockChainStatus: false};
  }
}
