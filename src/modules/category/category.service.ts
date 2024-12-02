import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { DeepPartial, Repository } from 'typeorm';
import { CategoryEntity } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { S3Service } from '../s3/s3.service';
import { toBoolean } from 'src/common/utilities/function.utils';
import { isBoolean } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import {
  paginationGenerator,
  paginationSolver,
} from 'src/common/utilities/pagination.util';

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
    const { Location, Key } = await this.s3Service.uploadFile(
      image,
      'snappfood-image',
    );
    // eslint-disable-next-line prefer-const
    let { slug, title, show, parentId } = createCategoryDto;
    const category = await this.findOneBySlug(slug);
    if (category) throw new ConflictException('Category already exists');
    if (isBoolean(show)) {
      show = toBoolean(show);
    }
    let parent: CategoryEntity = null;
    if (parentId && !isNaN(parentId)) {
      parent = await this.findOneById(+parentId);
    }
    await this.categoryRepository.insert({
      title,
      slug,
      show,
      image: Location,
      imageKey: Key,
      parentId: parent?.id,
    });
    return { message: 'Category created successfully' };
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit, page, skip } = paginationSolver(
      paginationDto.page,
      paginationDto.limit,
    );
    const [categories, count] = await this.categoryRepository.findAndCount({
      where: {},
      relations: {
        parent: true,
      },
      select: {
        parent: { title: true },
      },
      skip,
      take: limit,
      order: { id: 'DESC' },
    });
    return {
      pagination: paginationGenerator(count, page, limit),
      categories,
      count,
    };
  }

  async findOneById(id: number) {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async findOneBySlug(slug: string) {
    return await this.categoryRepository.findOneBy({ slug });
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
    image: Express.Multer.File,
  ) {
    const { title, show, parentId, slug } = updateCategoryDto;

    const category = await this.findOneById(id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const updateObject: DeepPartial<CategoryEntity> = {};

    if (image) {
      const { Location, Key } = await this.s3Service.uploadFile(
        image,
        'snappfood-image',
      );

      if (!Key) {
        throw new ConflictException('Image upload failed');
      }

      updateObject['image'] = Location;
      updateObject['imageKey'] = Key;

      if (category.imageKey) {
        await this.s3Service.deleteFile(category.imageKey);
      }
    }

    if (title) {
      updateObject['title'] = title;
    }

    if (typeof show !== 'undefined') {
      updateObject['show'] = toBoolean(show);
    }

    if (parentId && !isNaN(parseInt(parentId.toString()))) {
      const parent = await this.findOneById(+parentId);
      if (!parent) {
        throw new NotFoundException('Parent category not found');
      }
      updateObject['parentId'] = parent.id;
    }

    if (slug) {
      const existingCategory = await this.categoryRepository.findOneBy({
        slug,
      });
      if (existingCategory && existingCategory.id !== id) {
        throw new ConflictException('Category with this slug already exists');
      }
      updateObject['slug'] = slug;
    }

    await this.categoryRepository.update({ id }, updateObject);

    return {
      message: 'Category updated successfully',
    };
  }

  async remove(id: number) {
    const category = await this.findOneById(id);
    if (!category) throw new NotFoundException('Category not found');
    await this.categoryRepository.delete({ id });
    return { message: 'Category deleted successfully' };
  }

  async findBySlug(slug: string) {
    const category = await this.categoryRepository.findOne({
      where: { slug },
      relations: { children: true },
    });
    if (!category) throw new NotFoundException('Category not found');
    return { category };
  }
}
