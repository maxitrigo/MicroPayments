import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductDto extends PartialType(CreateProductDto) {
    
    @ApiProperty({ example: 'Apple, Pepsi, Subscription' })
    @IsString()
    name?: string;
    
    @ApiProperty({ example: 'a detailed or not detailed description of the product' })
    @IsString()
    description?: string;
    
    @ApiProperty({ example: 100 })
    @IsNumber()
    price?: number;
    
    @ApiProperty({ example: 10 })
    @IsNumber()
    stock?: number;
    
    @ApiProperty({ example: 'Food, Electronics, Subscriptions' })
    @IsString()
    category?: string;
}
