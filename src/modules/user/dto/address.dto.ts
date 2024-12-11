import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Length } from 'class-validator';

export class CreateUserAddressDto {
  @ApiProperty()
  @Length(3, 50)
  title: string;
  @ApiProperty()
  province: string;
  @ApiProperty()
  city: string;
  @ApiProperty()
  @Length(3, 150)
  address: string;
  @ApiProperty()
  postal_code?: string;
}

export class UpdateUserAddressDto extends PartialType(CreateUserAddressDto) {}
