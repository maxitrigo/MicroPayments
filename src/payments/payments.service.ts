import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import MercadoPagoConfig, { Preference } from 'mercadopago';
import { MERCADOPAGO_ACCESS_TOKEN } from 'src/config/env.config';
import { JwtService } from '@nestjs/jwt';
import { TransactionsService } from 'src/transactions/transactions.service';
import axios from 'axios';

@Injectable()
export class PaymentsService {

  constructor(
    private readonly jwtService: JwtService,
    private readonly transactionsService: TransactionsService
  ) {}

  async create(createPaymentDto: CreatePaymentDto, token: string) {

    const decoded = this.jwtService.decode(token);
    const clientId = decoded.id
    const productId = createPaymentDto.productId

    const payload = this.jwtService.sign({
      clientId: clientId,
      productId: productId
    })
    
    const client = new MercadoPagoConfig({
      accessToken: MERCADOPAGO_ACCESS_TOKEN
    })

    const preference = new Preference(client)

    const result = await preference.create({
      body: {
        items: [
          {
            id: createPaymentDto.id,
            title: createPaymentDto.title,
            description: createPaymentDto.description,
            quantity: createPaymentDto.quantity,
            currency_id: 'UYU',
            unit_price: createPaymentDto.unit_price
          }
        ],
        payment_methods: {
          excluded_payment_types: [
            {
              id: 'ticket'
            }
          ],
          installments: 1
        },
        external_reference: payload,
        back_urls: {
          success: 'http://localhost:3000/payments/success',
          failure: 'http://localhost:3000/failure',
          pending: 'http://localhost:3000/pending'
        },
        auto_return: 'approved'
      }
    })

    const init_point = result.init_point

    return { init_point }

  }

  async handlePaymentSuccess(externalReference: string, paymentId: string) {

    const verification = await axios.get(`https://api.mercadopago.com/v1/payments/${paymentId}?access_token=${MERCADOPAGO_ACCESS_TOKEN}`)

    const decode = this.jwtService.decode(externalReference)
    const clientId = decode.clientId
    const productId = decode.productId

    const netReceivedAmount = verification.data.transaction_details.net_received_amount
    const totalPaidAmount = verification.data.transaction_details.total_paid_amount

    if (verification.data.status_detail === 'accredited'){
      await this.transactionsService.create({
        clientId: clientId,
        productId: productId,
        paymentType: 'mercado_pago',
        paymentId: paymentId,
        amount: totalPaidAmount,
        netAmount: netReceivedAmount
      })
    }

    return {
      status: verification.data.status_detail,
      productId: productId,
      paymentId: paymentId
    }
  }

}
