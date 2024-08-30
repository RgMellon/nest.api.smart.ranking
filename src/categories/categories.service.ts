import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './interfaces/category.interface';
import { CreateCategoryDto } from './dtos/create.categories.dto';
import { UpdateCategories } from './dtos/update.categories.dto';
import { PlayersService } from 'src/players/players.service';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel('Category') private readonly categoryModel: Model<Category>,
    private readonly playerService: PlayersService,
  ) {}

  async create(payload: CreateCategoryDto): Promise<Category> {
    const { category } = payload;

    const foundCategory = await this.categoryModel
      .findOne({
        category: category,
      })
      .exec();

    if (foundCategory) {
      throw new Error(`Category ${category} already exists.`);
    }

    const createdCategory = new this.categoryModel(payload);
    return await createdCategory.save();
  }

  async getAll(): Promise<Category[]> {
    return await this.categoryModel.find().populate('players').exec();
  }

  async findById(id: string): Promise<Category> {
    if (!id) {
      throw new Error('Invalid ID provided.');
    }

    const result = await this.categoryModel
      .findById({
        _id: id,
      })
      .exec();

    if (!result) {
      throw new Error(`Category with ID ${id} not found.`);
    }

    return result;
  }

  async update(body: UpdateCategories, id: string): Promise<void> {
    if (!id) {
      throw new Error('Invalid ID provided.');
    }

    const updatedCategory = await this.categoryModel
      .findByIdAndUpdate(
        {
          _id: id,
        },
        {
          $set: {
            description: body.description,
            events: body.events,
          },
        },
        { new: true },
      )
      .exec();

    if (!updatedCategory) {
      throw new Error(`Category with ID ${id} not found.`);
    }
  }

  async addPlayerToCategory(category: string, playerId: string): Promise<void> {
    const foundPlayer = await this.playerService.getPlayerById(playerId);

    if (!foundPlayer) {
      throw new BadRequestException(`Player with ID ${playerId} not exists`);
    }

    const playerExistsOnCategory = await this.categoryModel
      .find({ _id: category })
      .where('players')
      .in(foundPlayer.id);

    if (playerExistsOnCategory.length > 0) {
      throw new BadRequestException(
        `Player with ID ${playerId} already exists on category ${category}`,
      );
    }

    const updatedCategory = await this.categoryModel
      .findByIdAndUpdate(
        {
          _id: category,
        },
        {
          $push: {
            players: playerId,
          },
        },
        { new: true },
      )
      .exec();

    if (!updatedCategory) {
      throw new Error(`Category ${category} not found.`);
    }
  }

  async getCategoryByPlayer(playerId: any): Promise<Category> {
    const foundPlayer = await this.playerService.getPlayerById(playerId);

    if (!foundPlayer) {
      throw new BadRequestException(`Player with ID ${playerId} not exists`);
    }

    return await this.categoryModel
      .findOne()
      .where('players')
      .in(playerId)
      .exec();
  }
}
