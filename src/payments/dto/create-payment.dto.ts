export class CreatePaymentDto {
    id: string;
    title: string;
    description: string;
    quantity: number;
    unit_price: number;
    cliendId: string;
    productId: string;
}
