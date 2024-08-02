import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { Player } from './interfaces/player.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdatePlayerDto } from './dtos/update-player.dto copy';

@Injectable()
export class PlayersService {
  private readonly logger = new Logger(PlayersService.name);

  constructor(
    @InjectModel('Player') private readonly playerModel: Model<Player>,
  ) {}

  async createPlayer(payload: CreatePlayerDto): Promise<void> {
    this.logger.log(`payload ${JSON.stringify(payload)}}`);

    this.create(payload);
  }

  async updatePlayer(id: string, payload: UpdatePlayerDto): Promise<void> {
    const found = await this.playerModel
      .findOne({
        _id: id,
      })
      .exec();

    if (found) {
      this.update(payload, id);
    }

    throw new NotFoundException(`Player with id ${id} not found.`);
  }

  async getAllPlayers(): Promise<Player[]> {
    return await this.playerModel.find().exec();
  }

  private async create(payload: CreatePlayerDto): Promise<Player> {
    const newPlayer = new this.playerModel(payload);
    return await newPlayer.save();
  }

  private async update(payload: UpdatePlayerDto, id: string): Promise<Player> {
    return await this.playerModel
      .findByIdAndUpdate({ _id: id }, { $set: payload })
      .exec();
  }

  async getPlayerById(id: string): Promise<Player> {
    const foundPlayer = await this.playerModel.findOne({ id }).exec();

    if (!foundPlayer) {
      throw new NotFoundException(`Player with email ${id} not found.`);
    }

    return foundPlayer;
  }

  async deletePlayer(id: string): Promise<Player> {
    return await this.playerModel.findByIdAndDelete(id).exec();
  }
}
