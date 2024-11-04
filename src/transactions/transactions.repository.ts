import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Between, In, Repository } from "typeorm";
import { Transactions } from "./entities/transaction.entity";
import { UpdateTransactionDto } from "./dto/update-transaction.dto";
import { CreateTransactionDto } from "./dto/create-transaction.dto";

@Injectable()
export class TransactionsRepository {
    constructor(
        @InjectRepository(Transactions) private readonly transactionsRepository: Repository<Transactions>,
    ) {}

    async findAll() {
        return await this.transactionsRepository.find();
    }

    async findByClientId(clientId: string) {
        return await this.transactionsRepository.findOneBy({clientId});
    }

    async findByProductId(productId: string) {
        return await this.transactionsRepository.findOneBy({productId});
    }

    async findByDate(date: Date) {
        return await this.transactionsRepository.findBy({date});
    }

    async findByPaymentType(paymentType: string) {
        return await this.transactionsRepository.findBy({paymentType});
    }

    async findByDateRange(dateStart: Date, dateEnd: Date) {
        return await this.transactionsRepository.find({
            where: {
                date: Between(dateStart, dateEnd)
            }
        })
    }

    async create(createTransactionDto: CreateTransactionDto) {
        return await this.transactionsRepository.save(createTransactionDto);
    }

    async update(id: string, updateTransactionDto: UpdateTransactionDto) {
        return await this.transactionsRepository.update({ id }, updateTransactionDto);
    }

}