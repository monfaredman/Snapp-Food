import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EntityNames } from 'src/common/enum/entity-name.enum';
import { SupplierEntity } from './supplier.entity';

@Entity(EntityNames.SupplierOtp)
export class SupplierOTPEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column()
  code: string;
  @Column()
  expires_in: Date;
  @Column()
  supplierId: number;
  @OneToOne(() => SupplierEntity, (supplier) => supplier.otp, {
    onDelete: 'CASCADE',
  })
  supplier: SupplierEntity;
}
