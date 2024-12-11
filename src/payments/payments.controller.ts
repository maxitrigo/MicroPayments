import { Controller, Get, Post, Body, Query, UseGuards, Res } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Headers } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { Response } from 'express';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';


@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService
  ) {}

  @Post('subscriptions')
  @UseGuards(AuthGuard)
  @ApiOperation({summary: 'Create payment'})
  @ApiResponse({status: 201, description: 'Payment created.'})
  @ApiResponse({status: 400, description: 'Bad Request'})
  @ApiBearerAuth()
  create(@Body('payment') createPaymentDto: CreatePaymentDto,@Headers('authorization') headers: string, @Body('gymToken') gymToken: string, @Body('slug') slug: string) {
    const token = headers.split(' ')[1];
    return this.paymentsService.create(createPaymentDto, token, gymToken, slug);
  }

  @Get('success')
  async handlePaymentSuccess(
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

    const success = await this.paymentsService.handlePaymentSuccess(externalReference, paymentId);

    const redirecUrl = `http://localhost:5173/${success.slug}/subscriptions`
    res.redirect(redirecUrl);

  }

  @Get('successGyms')
  async handlePaymentSuccessGyms(
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

    const success = await this.paymentsService.handlePaymentSuccessGyms(externalReference, paymentId);

    const redirecUrl = `http://localhost:5173/${success.slug}/subscriptions`
    res.redirect(redirecUrl);

  }
}
