import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsRepository } from './products.repository';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productsRepository: ProductsRepository
  ) {}

  async create(createProductDto: CreateProductDto) {
    return await this.productsRepository.create(createProductDto);
  }

  async findAll() {
    return await this.productsRepository.findAll();
  }

  async findOne(id: string) {
    return await this.productsRepository.findOne(id);
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    return await this.productsRepository.update(id, updateProductDto);
  }

  async remove(id: string) {
    return await this.productsRepository.delete(id);
  }
}
