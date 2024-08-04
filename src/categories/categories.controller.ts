import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateCategoryDto } from './dtos/create.categories.dto';
import { CategoriesService } from './categories.service';
import { Category } from './interfaces/category.interface';
import { UpdateCategories } from './dtos/update.categories.dto';

@Controller('api/v1/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async create(@Body() body: CreateCategoryDto): Promise<void> {
    await this.categoriesService.create(body);
  }

  @Get()
  async getAllCategories(): Promise<Category[]> {
    return await this.categoriesService.getAll();
  }

  @Get('/:id')
  async getCategoryById(@Param('id') id: string): Promise<Category> {
    return await this.categoriesService.findById(id);
  }

  @Put('/:id')
  @UsePipes(ValidationPipe)
  async update(
    @Param('id') id: string,
    @Body() body: UpdateCategories,
  ): Promise<void> {
    this.categoriesService.update(body, id);
  }

  @Post('/:category/players/:playerId')
  async addPlayerToCategory(
    @Param('category') category: string,
    @Param('playerId') playerId: string,
  ): Promise<void> {
    await this.categoriesService.addPlayerToCategory(category, playerId);
  }
}
