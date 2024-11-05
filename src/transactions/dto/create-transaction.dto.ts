import { Injectable } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

@Injectable()
export class CreateTransactionDto {

    @ApiProperty({ example: '312308-1234-1234-1234' })
    @IsString()
    clientId: string;

    @ApiProperty({ example: '312308-1234-1234-1234' })
    @IsString()
    productId: string;

    @ApiProperty({ example: 'card' })
    @IsString()
    paymentType: string;

    @ApiProperty({ example: '1kjb123nk23' })
    @IsString()
    paymentId: string;

    @ApiProperty({ example: 100 })
    @IsString()
    amount: number;

    @ApiProperty({ example: 10 })
    @IsString()
    netAmount: number;
}
