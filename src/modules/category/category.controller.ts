import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  ParseFilePipe,
  MaxFileSizeValidator,
  UploadedFile,
  FileTypeValidator,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ApiConsumes } from '@nestjs/swagger';
import { UploadFileS3 } from 'src/common/interceptors/upload-file.interceptor';
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
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
}
