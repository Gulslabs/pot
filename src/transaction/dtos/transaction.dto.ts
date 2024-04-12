import { ApiProperty } from "@nestjs/swagger";

// transaction.dto.ts
export class TransactionDto {  
  @ApiProperty({description: "Identity of the trasaction"})
  id: string;
  @ApiProperty({description: "Type of Trade, Buy or Sell"})
  type: 'buy' | 'sell';

  @ApiProperty({description: "Security Identifier"})  
  fundSymbol: string;

  @ApiProperty({description: "Transaction Execution Date/Time"})  
  date: Date;

  @ApiProperty({description: "Transaction Price"})  
  price: number;
  //TODO: Add other details as needed
}
