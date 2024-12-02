import { CategoryService } from './../category/category.service';
import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { SupplierSignupDto } from './dto/supplier.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SupplierEntity } from './entities/supplier.entity';
import { Repository } from 'typeorm';
import { randomInt } from 'crypto';
import { SupplierOTPEntity } from './entities/otp.entity';

@Injectable()
export class SupplierService {
  constructor(
    @InjectRepository(SupplierEntity)
    private supplierRepository: Repository<SupplierEntity>,
    private supplierOTPRepository: Repository<SupplierOTPEntity>,
    private categoryService: CategoryService,
  ) {}

  async signup(supplierSignupDto: SupplierSignupDto) {
    const {
      categoryId,
      city,
      invite_code,
      manager_family,
      manager_name,
      phone,
      store_name,
    } = supplierSignupDto;

    const supplier = await this.supplierRepository.findOneBy({ phone });
    if (supplier) throw new ConflictException('Supplier already exists');
    const category = this.categoryService.findOneById(categoryId);
    let agent: SupplierEntity = null;
    if (invite_code) {
      agent = await this.supplierRepository.findOneBy({ invite_code });
    }
    const mobileNumber = parseInt(phone);
    const newSupplier = this.supplierRepository.create({
      manager_name,
      manager_family,
      phone,
      categoryId: (await category).id,
      city,
      store_name,
      agentId: agent?.id ?? null,
      invite_code: mobileNumber.toString(32).toUpperCase(),
    });
    await this.supplierRepository.save(newSupplier);
    await this.createOtpForSupplier(newSupplier);
    return { message: 'Supplier created successfully' };
  }

  async createOtpForSupplier(supplier: SupplierEntity) {
    const expiresIn = new Date(new Date().getTime() + 1000 * 60 * 2);
    const code = randomInt(10000, 99999).toString();
    let otp = await this.supplierOTPRepository.findOneBy({
      supplierId: supplier.id,
    });
    if (otp) {
      if (otp.expires_in > new Date()) {
        throw new BadRequestException('otp code not expired');
      }
      otp.code = code;
      otp.expires_in = expiresIn;
    } else {
      otp = this.supplierOTPRepository.create({
        code,
        expires_in: expiresIn,
        supplierId: supplier.id,
      });
    }
    otp = await this.supplierOTPRepository.save(otp);
    supplier.otpId = otp.id;
    await this.supplierRepository.save(supplier);
  }
}
