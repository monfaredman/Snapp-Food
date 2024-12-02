import { Controller, Post, Body } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { SupplierSignupDto } from './dto/supplier.dto';

@Controller('supplier')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Post()
  signup(@Body() supplierSignupDto: SupplierSignupDto) {
    return this.supplierService.signup(supplierSignupDto);
  }
}
