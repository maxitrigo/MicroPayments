import { Controller, Get, Post, Body, Query, UseGuards, Res } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Headers } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { Response } from 'express';


@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createPaymentDto: CreatePaymentDto, @Headers('authorization') headers: string) {
    const token = headers.split(' ')[1];
    return this.paymentsService.create(createPaymentDto, token);
  }

  @Get('success')
  handlePaymentSuccess(
    @Query('collection_id') collectionId: string,
    @Query('collection_status') collectionStatus: string,
    @Query('payment_id') paymentId: string,
    @Query('status') status: string,
    @Query('external_reference') externalReference: string,
    @Query('payment_type') paymentType: string,
    @Query('merchant_order_id') merchantOrderId: string,
    @Query('preference_id') preferenceId: string,
    @Query('site_id') siteId: string,
    @Query('processing_mode') processingMode: string,
    @Query('merchant_account_id') merchantAccountId: string,
    @Res() res: Response
  ) {

   this.paymentsService.handlePaymentSuccess(externalReference, paymentId);

    const redirecUrl = 'https://yochambeo.com'
    res.redirect(redirecUrl);

  }
}
