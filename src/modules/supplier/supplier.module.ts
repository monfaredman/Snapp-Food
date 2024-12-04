import { Module } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { SupplierController } from './supplier.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupplierEntity } from './entities/supplier.entity';
import { S3Service } from '../s3/s3.service';
import { CategoryService } from '../category/category.service';
import { CategoryEntity } from '../category/entities/category.entity';
import { JwtService } from '@nestjs/jwt';
import { SupplierOTPEntity } from './entities/otp.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SupplierEntity,
      SupplierOTPEntity,
      CategoryEntity,
    ]),
  ],
  controllers: [SupplierController],
  providers: [SupplierService, S3Service, CategoryService, JwtService],
  exports: [SupplierService, JwtService, S3Service, TypeOrmModule],
})
export class SupplierModule {}
