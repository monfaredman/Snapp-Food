import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { BasketService } from '../basket/basket.service';
import { UserBasketEntity } from '../basket/entities/basket.entity';
import { DiscountService } from '../discount/discount.service';
import { DiscountEntity } from '../discount/entities/discount.entity';
import { MenuEntity } from '../menu/entities/menu.entity';
import { TypeEntity } from '../menu/entities/type.entity';
import { MenuService } from '../menu/services/menu.service';
import { MenuTypeService } from '../menu/services/type.service';
import { OrderEntity } from '../order/entities/order.entity';
import { OrderService } from '../order/order.service';
import { S3Service } from '../s3/s3.service';
import { UserAddressEntity } from '../user/entities/address.entity';
import { PaymentEntity } from './entities/payment.entity';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      UserBasketEntity,
      DiscountEntity,
      MenuEntity,
      TypeEntity,
      OrderEntity,
      UserAddressEntity,
      PaymentEntity,
    ]),
  ],
  providers: [
    PaymentService,
    BasketService,
    MenuService,
    DiscountService,
    MenuTypeService,
    OrderService,
    S3Service,
  ],
  controllers: [PaymentController],
  exports: [],
})
export class PaymentModule {}
