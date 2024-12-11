import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { AddressService } from '../services/address.service';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { UserAuth } from 'src/common/decorators/auth.decorator';
import { CreateUserAddressDto, UpdateUserAddressDto } from '../dto/address.dto';
import { FormType } from 'src/common/enum/form-type.enum';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Pagination } from 'src/common/decorators/pagination.decorator';

@Controller('address')
@ApiTags('Address')
@UserAuth()
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  @ApiConsumes(FormType.Urlencoded)
  create(@Body() createUserAddressDto: CreateUserAddressDto) {
    return this.addressService.create(createUserAddressDto);
  }

  @Get()
  @Pagination()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.addressService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.addressService.findOne(+id);
  }

  @Patch(':id')
  @ApiConsumes(FormType.Multipart)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserAddressDto: UpdateUserAddressDto,
  ) {
    return this.addressService.update(id, updateUserAddressDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.addressService.delete(id);
  }
}
