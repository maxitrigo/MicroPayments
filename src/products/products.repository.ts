import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Products } from "./entities/product.entity";
import { Repository } from "typeorm";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";

@Injectable()
export class ProductsRepository {
    constructor(
        @InjectRepository(Products) private readonly productsRepository: Repository<Products>
    ) {}

    async create(createProductDto: CreateProductDto) {
        return await this.productsRepository.save(createProductDto);
    }

    async findAll() {
        return await this.productsRepository.find();
    }

    async findOne(id: string) {
        return await this.productsRepository.findOneBy({id});
    }

    async update(id: string, updateProductDto: UpdateProductDto) {
        return await this.productsRepository.update({ id }, updateProductDto);
    }

    async delete(id: string) {
        return await this.productsRepository.delete({ id });
    }
}