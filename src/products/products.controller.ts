import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Headers } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AdminGuard } from 'src/guards/admin.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}


  @Post()
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Create a product' })
  @ApiResponse({ status: 201, description: 'The product has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Forbidden.' })
  @ApiBearerAuth()
  create(@Body() createProductDto: CreateProductDto, @Headers('authorization') headers: string) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Find all products' })
  @ApiResponse({ status: 201, description: 'The products have been successfully found.' })
  @ApiResponse({ status: 400, description: 'Forbidden.' })
  @ApiBearerAuth()
  findAll(@Headers('authorization') headers: string) {
    return this.productsService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Find one product' })
  @ApiResponse({ status: 201, description: 'The product has been successfully found.' })
  @ApiResponse({ status: 400, description: 'Forbidden.' })
  @ApiBearerAuth()
  findOne(@Param('id') id: string, @Headers('authorization') headers: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Update a product' })
  @ApiResponse({ status: 201, description: 'The product has been successfully updated.' })
  @ApiResponse({ status: 400, description: 'Forbidden.' })
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto, @Headers('authorization') headers: string) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Delete a product' })
  @ApiResponse({ status: 201, description: 'The product has been successfully deleted.' })
  @ApiResponse({ status: 400, description: 'Forbidden.' })
  @ApiBearerAuth()
  remove(@Param('id') id: string, @Headers('authorization') headers: string) {
    return this.productsService.remove(id);
  }
}
