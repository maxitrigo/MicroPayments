import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { TransactionsModule } from './transactions/transactions.module';
import { DatabaseModule } from './database/database.module';
import { JwtModule } from '@nestjs/jwt';
import { JWT_SECRET } from './config/env.config';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [
    ProductsModule, 
    TransactionsModule, 
    DatabaseModule,
    JwtModule.register({
      global: true,
      secret: JWT_SECRET,
      signOptions: { expiresIn: '4h' },
    }),
    PaymentsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
