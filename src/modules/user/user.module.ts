import { Module } from '@nestjs/common';
import { AddressController } from './controllers/address.controller';
import { AddressService } from './services/address.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAddressEntity } from './entities/address.entity';
import { UserEntity } from './entities/user.entity';
import { OTPEntity } from './entities/otp.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([UserAddressEntity, UserEntity, OTPEntity]),
  ],
  controllers: [AddressController],
  providers: [AddressService],
})
export class UserModule {}
