import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { Player } from './interfaces/player.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PlayersService {
  private readonly logger = new Logger(PlayersService.name);

  constructor(
    @InjectModel('Player') private readonly playerModel: Model<Player>,
  ) {}

  async createUpdatePlayer(payload: CreatePlayerDto): Promise<void> {
    this.logger.log(`payload ${JSON.stringify(payload)}}`);

    const { email } = payload;

    const found = await this.playerModel
      .findOne({
        email,
      })
      .exec();

    if (found) {
      this.update(payload);
      return;
    }

    this.create(payload);
  }

  async getAllPlayers(): Promise<Player[]> {
    return await this.playerModel.find().exec();
  }

  private async create(payload: CreatePlayerDto): Promise<Player> {
    const newPlayer = new this.playerModel(payload);
    return await newPlayer.save();
  }

  private async update(payload: CreatePlayerDto): Promise<Player> {
    return await this.playerModel
      .findByIdAndUpdate({ email: payload.email }, { $set: payload })
      .exec();
  }

  async getPlayerByEmail(email: string): Promise<Player> {
    const foundPlayer = await this.playerModel.findOne({ email }).exec();

    if (!foundPlayer) {
      throw new NotFoundException(`Player with email ${email} not found.`);
    }

    return foundPlayer;
  }

  async deletePlayer(id: string): Promise<Player> {
    return await this.playerModel.findByIdAndDelete(id).exec();
  }
}
