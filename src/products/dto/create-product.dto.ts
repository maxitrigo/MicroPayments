import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, isString, IsString } from "class-validator";

export class CreateProductDto {
    @ApiProperty({ example: 'Apple, Pepsi, Subscription' })
    @IsString()
    name: string;

    @ApiProperty({ example: 'a detailed or not detailed description of the product' })
    @IsString()
    description: string;

    @ApiProperty({ example: 100 })
    @IsNumber()
    price: number;

    @ApiProperty({ example: 10 })
    @IsNumber()
    stock: number;

    @ApiProperty({ example: 'Food, Electronics, Subscriptions' })
    @IsString()
    category: string;
}
