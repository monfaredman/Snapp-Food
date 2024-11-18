import { ConflictException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Repository } from 'typeorm';
import { CategoryEntity } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { S3Service } from '../s3/s3.service';
import { toBoolean } from 'src/common/utilities/function.utils';
import { isBoolean } from 'class-validator';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
    private s3Service: S3Service,
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
    image: Express.Multer.File,
  ) {
    const { Location } = await this.s3Service.uploadFile(
      image,
      'snappfood-image',
    );
    let { slug, title, show } = createCategoryDto;
    const category = await this.findOneBySlug(slug);
    if (category) throw new ConflictException('Category already exists');
    if (isBoolean(show)) {
      show = toBoolean(show);
    }
    await this.categoryRepository.insert({
      title,
      slug,
      show,
      image: Location,
    });
    return { message: 'Category created successfully' };
  }

  findAll() {
    return `This action returns all category`;
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  async findOneBySlug(slug: string) {
    return await this.categoryRepository.findOneBy({ slug });
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
