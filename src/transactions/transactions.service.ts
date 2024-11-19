import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionsRepository } from './transactions.repository';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly transactionsRepository: TransactionsRepository
  ) {}

  async create(createTransactionDto: CreateTransactionDto) {
    return await this.transactionsRepository.create(createTransactionDto);
  }

  async findAll() {
    return await this.transactionsRepository.findAll();
  }

  async findByGymId(gymToken: string) {
    const decoded = this.jwtService.decode(gymToken);
    const gymId = decoded.id
    return await this.transactionsRepository.findByGymId(gymId);
  }

  async findByClientId(token: string) {
    const decoded = this.jwtService.decode(token);
    const clientId = decoded.id
    return await this.transactionsRepository.findByClientId(clientId);
  }

  async findByPaymentId(paymentId: string) {
    if (!paymentId) {
      throw new BadRequestException('Payment ID is required');
    }

    const existingTransaction = await this.transactionsRepository.findByPaymentId(paymentId);

    if(!existingTransaction) {
      throw new BadRequestException('Payment ID not found');
    }

    return existingTransaction

  }

  async findByProductId(productId: string) {
    return await this.transactionsRepository.findByProductId(productId);
  }

  async findByDate(date: Date) {
    return await this.transactionsRepository.findByDate(date);
  }

  async findByPaymentType(paymentType: string) {
    return await this.transactionsRepository.findByPaymentType(paymentType);
  }

  async findByDateRange(dateStart: Date, dateEnd: Date) {
    return await this.transactionsRepository.findByDateRange(dateStart, dateEnd);
  }

  async update(id: string, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  async remove(id: string, gymToken: string) {
    const decoded = this.jwtService.decode(gymToken);
    const gymId = decoded.id
    return await this.transactionsRepository.remove(id, gymId);
  }

}
