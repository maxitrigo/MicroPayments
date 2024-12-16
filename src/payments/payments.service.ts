import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import MercadoPagoConfig, { Preference } from 'mercadopago';
import { MERCADOPAGO_ACCESS_TOKEN } from 'src/config/env.config';
import { JwtService } from '@nestjs/jwt';
import { TransactionsService } from 'src/transactions/transactions.service';
import axios from 'axios';
import { Roles } from 'src/Roles/roles.enum';

@Injectable()
export class PaymentsService {

  constructor(
    private readonly jwtService: JwtService,
    private readonly transactionsService: TransactionsService
  ) {}

  async create(createPaymentDto: CreatePaymentDto, token: string, gymToken: string, slug: string) {    
    const decodedGym = this.jwtService.decode(gymToken);
    const decodedUser = this.jwtService.decode(token);
    const currentDate = new Date()
    const subscriptionEndDate = new Date(decodedGym.subscriptionEnd)
    if(decodedUser.role === Roles.User && subscriptionEndDate < currentDate){
      throw new BadRequestException('Your subscription has expired');
    }
    const clientId = decodedUser.id
    const productId = createPaymentDto.productId
    const external = slug

    if(decodedUser.role === Roles.Admin) {
      const client = new MercadoPagoConfig({
        accessToken: MERCADOPAGO_ACCESS_TOKEN
      })
  
      const preference = new Preference(client)
  
      const result = await preference.create({
        body: {
          items: [
            {
              id: productId,
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
          metadata: {
            client_id: clientId,
            product_id: productId
          },
          external_reference: external,
          back_urls: {
            success: 'https://tr.gym-metrics.com/payments/successGyms',
            failure: `https://gym-metrics.com/${slug}/home`,
            pending: `https://gym-metrics.com/${slug}/home`
          },
          auto_return: 'approved'
        }
      })
  
      const init_point = result.init_point
  
      return { init_point }
    }

    

    const MP_ACCESS_TOKEN = decodedGym.mercadopago
    
    const client = new MercadoPagoConfig({
      accessToken: MP_ACCESS_TOKEN
    })

    const preference = new Preference(client)

    const result = await preference.create({
      body: {
        items: [
          {
            id: productId,
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
        metadata: {
          client_id: clientId,
          product_id: productId
        },
        external_reference: external,
        back_urls: {
          success: 'https://tr.gym-metrics.com/payments/successGyms',
          failure: `https://gym-metrics.com/${slug}/home`,
          pending: `https://gym-metrics.com/${slug}/home`
        },
        auto_return: 'approved'
      }
    })

    const init_point = result.init_point

    return { init_point }

  }

  async handlePaymentSuccess(externalReference: string, paymentId: string) {
    const gymSlug = externalReference
    const payload = {
      slug: gymSlug
    }
    const token = this.jwtService.sign(payload)

    const GYM = await axios.get(`https://gym.gym-metrics.com/gyms/${gymSlug}`,
      {
        headers: {
          authorization: `Bearer ${token}`
      }}
    )

    const gymToken = GYM.data.gymToken
    const decodedGym = this.jwtService.decode(gymToken);
    const MP_ACCESS_TOKEN = decodedGym.mercadopago

    const verification = await axios.get(`https://api.mercadopago.com/v1/payments/${paymentId}?access_token=${MP_ACCESS_TOKEN}`)

    const productId = verification.data.metadata.product_id
    const clientId = verification.data.metadata.client_id

    const netReceivedAmount = verification.data.transaction_details.net_received_amount
    const totalPaidAmount = verification.data.transaction_details.total_paid_amount

    if (verification.data.status_detail === 'accredited'){
      await this.transactionsService.create({
        clientId: clientId,
        productId: productId,
        paymentType: 'Mercado Pago',
        paymentId: paymentId,
        amount: totalPaidAmount,
        netAmount: netReceivedAmount,
        gymId: decodedGym.id,
        role: 'user'
      })

    }

    const userToken = this.jwtService.sign({
      clientId: clientId,
      productId: productId,
      role: 'admin'
    })
    const updateUser = await axios.post(
      `https://gym.gym-metrics.com/users/update-subscription`,
      {},
      {
        headers: {
          authorization: `Bearer ${userToken}`
        }
      }
    )


    return {
      status: verification.data.status_detail,
      productId: productId,
      paymentId: paymentId,
      slug: externalReference
    }
  }

  async handlePaymentSuccessGyms(externalReference: string, paymentId: string) {
    const gymSlug = externalReference
    const payload = {
      slug: gymSlug
    }
    const token = this.jwtService.sign(payload)

    const GYM = await axios.get(`https://gym.gym-metrics.com/gyms/${gymSlug}`,
      {
        headers: {
          authorization: `Bearer ${token}`
      }}
    )

    const gymToken = GYM.data.gymToken
    const decodedGym = this.jwtService.decode(gymToken);
    const MP_ACCESS_TOKEN = MERCADOPAGO_ACCESS_TOKEN

    const verification = await axios.get(`https://api.mercadopago.com/v1/payments/${paymentId}?access_token=${MP_ACCESS_TOKEN}`)

    const productId = verification.data.metadata.product_id
    const clientId = verification.data.metadata.client_id

    const netReceivedAmount = verification.data.transaction_details.net_received_amount
    const totalPaidAmount = verification.data.transaction_details.total_paid_amount

    if (verification.data.status_detail === 'accredited'){
      await this.transactionsService.create({
        clientId: clientId,
        productId: productId,
        paymentType: 'Mercado Pago',
        paymentId: paymentId,
        amount: totalPaidAmount,
        netAmount: netReceivedAmount,
        gymId: decodedGym.id,
        role: 'user'
      })

    }

    const userToken = this.jwtService.sign({
      clientId: clientId,
      gymId: decodedGym.id,
      productId: productId,
      role: 'admin'
    })
    const updateUser = await axios.post(
      `https://gym.gym-metrics.com/gyms/extend-subscription`,
      {},
      {
        headers: {
          authorization: `Bearer ${userToken}`
        }
      }
    )


    return {
      status: verification.data.status_detail,
      productId: productId,
      paymentId: paymentId,
      slug: externalReference
    }
  }
  

}


