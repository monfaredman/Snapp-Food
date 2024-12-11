import {
  CreateUserAddressDto,
  UpdateUserAddressDto,
} from './../dto/address.dto';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { UserAddressEntity } from '../entities/address.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import {
  paginationGenerator,
  paginationSolver,
} from 'src/common/utilities/pagination.util';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable({ scope: Scope.REQUEST })
export class AddressService {
  constructor(
    @InjectRepository(UserAddressEntity)
    private readonly addressRepository: Repository<UserAddressEntity>,
    @Inject(REQUEST) private req: Request,
  ) {}

  async create(createUserAddressDto: CreateUserAddressDto) {
    const { title, province, city, address, postal_code } =
      createUserAddressDto;
    const { id: userId } = this.req.user;

    const newAddress = this.addressRepository.create({
      title,
      province,
      city,
      address,
      postal_code,
      userId,
    });
    await this.addressRepository.save(newAddress);
    return {
      message: 'create',
    };
  }

  async findAll(paginationDto: PaginationDto) {
    const { id: userId } = this.req.user;
    const { limit, page, skip } = paginationSolver(
      paginationDto.page,
      paginationDto.limit,
    );
    const [addresses, count] = await this.addressRepository.findAndCount({
      where: { userId },
      skip,
      take: limit,
      order: { id: 'DESC' },
    });
    return {
      pagination: paginationGenerator(count, page, limit),
      addresses,
      count,
    };
  }

  async findOne(id: number) {
    const { id: userId } = this.req.user;
    const address = await this.addressRepository.findOneBy({
      id,
      userId,
    });
    if (!address)
      throw new NotFoundException(`Address with ID ${id} not found`);
    return address;
  }

  async update(id: number, updateUserAddressDto: UpdateUserAddressDto) {
    const { title, province, city, address, postal_code } =
      updateUserAddressDto;
    const addressItem = await this.findOne(id);
    if (!addressItem)
      throw new NotFoundException(`Address with ID ${id} not found`);
    const updateObject = {};
    console.log(title, province, city, address, postal_code);
    if (title) updateObject['title'] = title;
    if (province) updateObject['province'] = province;
    if (city) updateObject['city'] = city;
    if (address) updateObject['address'] = address;
    if (postal_code) updateObject['postal_code'] = postal_code;
    // Check if updateObject is empty
    console.log(updateObject);
    if (Object.keys(updateObject).length === 0) {
      throw new BadRequestException('No valid fields provided for update');
    }
    await this.addressRepository.update({ id }, updateObject);
    return {
      message: 'Address updated successfully',
    };
  }

  async delete(id: number) {
    await this.findOne(id);
    await this.addressRepository.delete(id);
    return {
      message: 'Address deleted successfully',
    };
  }
}
