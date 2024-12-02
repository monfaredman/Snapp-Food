import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  ParseFilePipe,
  MaxFileSizeValidator,
  UploadedFile,
  FileTypeValidator,
  Get,
  Param,
  Query,
  Patch,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ApiConsumes } from '@nestjs/swagger';
import { UploadFileS3 } from 'src/common/interceptors/upload-file.interceptor';
import { CategoryService } from './category.service';
import { Pagination } from 'src/common/decorators/pagination.decorator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { FormType } from 'src/common/enum/form-type.enum';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @ApiConsumes(FormType.Multipart)
  @UseInterceptors(UploadFileS3('image'))
  create(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }),
          new FileTypeValidator({
            fileType: 'image/(jpg|jpeg|png|webp)',
          }),
        ],
      }),
    )
    image: Express.Multer.File,
    @Body()
    createCategoryDto: CreateCategoryDto,
  ) {
    return this.categoryService.create(createCategoryDto, image);
  }

  @Get()
  @Pagination()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.categoryService.findAll(paginationDto);
  }
  @Get('/by-slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.categoryService.findBySlug(slug);
  }

  @Patch(':id')
  @ApiConsumes(FormType.Multipart)
  @UseInterceptors(UploadFileS3('image'))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }),
          new FileTypeValidator({
            fileType: 'image/(jpg|jpeg|png|webp)',
          }),
        ],
      }),
    )
    image: Express.Multer.File,
  ) {
    return this.categoryService.update(id, updateCategoryDto, image);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOneById(+id);
  }
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.remove(+id);
  }
}
