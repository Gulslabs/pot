import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TransactionDto } from './dtos/transaction.dto';
import { TransactionService } from './transation.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('pot')
@Controller('v1/pot')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('transactions')
  async createTransaction(@Body() transactionDto: TransactionDto) {
    await this.transactionService.emitTransaction(transactionDto);
    return 'Transaction emitted successfully';
  }
  @Get('transactions/:TRANSACTION_ID/verify')
  async verifyTransaction(@Param('TRANSACTION_ID') transactionId: string) {
    const result = await this.transactionService.verifyTransaction(transactionId);
    return {transactionExists: result};
  }
}
