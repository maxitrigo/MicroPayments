import { ApiProperty } from "@nestjs/swagger";

export class CreatePaymentDto {
    @ApiProperty({ example: 'suscription' })
    title: string;

    @ApiProperty({ example: 'a detailed or not detailed description of the product' })
    description: string;
    
    @ApiProperty({ example: 1 })
    quantity: number;

    @ApiProperty({ example: 100 })
    unit_price: number;

    @ApiProperty({ example: '312308-1234-1234-1234' })
    productId: string;
}
