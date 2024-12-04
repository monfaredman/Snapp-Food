import { PartialType } from '@nestjs/swagger';
import { SupplierSignupDto } from './supplier.dto';

export class UpdateSupplierDto extends PartialType(SupplierSignupDto) {}
