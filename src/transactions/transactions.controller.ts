import { Controller, Get, Post, Body, Patch, Param, UseGuards, Headers, Query, Delete } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AdminGuard } from 'src/guards/admin.guard';
import { AuthGuard } from 'src/guards/auth.guard';
import { JwtService } from '@nestjs/jwt';

@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly jwtService: JwtService
  ) {}

  @Post()
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Create a transaction.' })
  @ApiResponse({ status: 201, description: 'The transaction has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Forbidden.' })
  @ApiBearerAuth()
  create(@Body() Body, @Body('gymToken') gymToken: string, @Headers('authorization') headers: string) {
    const decoded = this.jwtService.decode(gymToken)
    const gymId = decoded.id
    const createTransactionDto: CreateTransactionDto = {...Body, gymId};
    return this.transactionsService.create(createTransactionDto);
  }

  @Get()
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Get all transactions' })
  @ApiResponse({ status: 201, description: 'Transactions successfully retrieved.' })
  @ApiResponse({ status: 400, description: 'Forbidden.' })
  @ApiBearerAuth()
  findAll(@Headers('authorization') headers: string) {
    return this.transactionsService.findAll();
  }

  @Get(':gymToken')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Get all transactions' })
  @ApiResponse({ status: 201, description: 'Transactions successfully retrieved!.' })
  @ApiResponse({ status: 400, description: 'Forbidden.' })
  findByGymId(@Param('gymToken') gymToken: string,@Headers('authorization') headers: string) {
    return this.transactionsService.findByGymId(gymToken);
  }


  @Get('paymentId')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get all transactions by client ' })
  @ApiResponse({ status: 201, description: 'Transaction successfully retrieved.' })
  @ApiResponse({ status: 400, description: 'Forbidden.' })
  @ApiBearerAuth()
  findByPaymentId(@Body('paymentId') paymentId: string, @Headers('authorization') headers: string) {
    return this.transactionsService.findByPaymentId(paymentId);
  }

  @Get('userId')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Get all transactions by client ' })
  @ApiResponse({ status: 201, description: 'Transaction successfully retrieved.' })
  @ApiResponse({ status: 400, description: 'Forbidden.' })
  @ApiBearerAuth()
  findByClientId( @Headers('authorization') headers: string) {
    const token = headers.split(' ')[1];
    return this.transactionsService.findByClientId(token);
  }

  @Get('productId')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Get all transactions by product' })
  @ApiResponse({ status: 201, description: 'Transaction successfully retrieved.' })
  @ApiResponse({ status: 400, description: 'Forbidden.' })
  @ApiBearerAuth()
  findByProductId(@Query('productId') productId: string , @Headers('authorization') headers: string) {
    return this.transactionsService.findByProductId(productId);
  }

  @Get('date')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Get all transactions by date' })
  @ApiResponse({ status: 201, description: 'Transaction successfully retrieved.' })
  @ApiResponse({ status: 400, description: 'Forbidden.' })
  @ApiBearerAuth()
  findByDate(@Query('date') date: string , @Headers('authorization') headers: string) {
    const newDate = new Date(date);
    return this.transactionsService.findByDate(newDate);
  }

  @Get('paymentType')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Get all transactions by payment type' })
  @ApiResponse({ status: 201, description: 'Transaction successfully retrieved.' })
  @ApiResponse({ status: 400, description: 'Forbidden.' })
  @ApiBearerAuth()
  findByPaymentType(@Query('paymentType') paymentType: string , @Headers('authorization') headers: string) {
    return this.transactionsService.findByPaymentType(paymentType);
  }

  @Get('dateRange')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Get all transactions by date range' })
  @ApiResponse({ status: 201, description: 'Transaction successfully retrieved.' })
  @ApiResponse({ status: 400, description: 'Forbidden.' })
  @ApiBearerAuth()
  findByDateRange(@Query('dateStart') dateStart: string, @Query('dateEnd') dateEnd: string, @Headers('authorization') headers: string) {
    const newDateStart = new Date(dateStart);
    const newDateEnd = new Date(dateEnd);
    return this.transactionsService.findByDateRange(newDateStart, newDateEnd);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Update a transaction' })
  @ApiResponse({ status: 201, description: 'Transactions successfully updated.' })
  @ApiResponse({ status: 400, description: 'Forbidden.' })
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() updateTransactionDto: UpdateTransactionDto, @Headers('authorization') headers: string) {
    return this.transactionsService.update(id, updateTransactionDto);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Delete a transaction' })
  @ApiResponse({ status: 201, description: 'Transactions successfully deleted.' })
  @ApiResponse({ status: 400, description: 'Forbidden.' })
  @ApiBearerAuth()
  remove(@Param('id') id: string, @Query('gymToken') gymToken: string,@Headers('authorization') headers: string) {
    return this.transactionsService.remove(id, gymToken);
  }

}
