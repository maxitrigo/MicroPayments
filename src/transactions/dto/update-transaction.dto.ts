import { PartialType } from '@nestjs/mapped-types';
import { CreateTransactionDto } from './create-transaction.dto';
import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {

    @ApiProperty({ example: '312308-1234-1234-1234' })
    @IsString()
    clientId?: string;

    @ApiProperty({ example: '312308-1234-1234-1234' })
    @IsString()
    productId?: string;

    @ApiProperty({ example: 'card' })
    @IsString()
    paymentType?: string;

    @ApiProperty({ example: 100 })
    @IsString()
    amount?: number;

    @ApiProperty({ example: 10 })
    @IsString()
    comission?: number;
}
