import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateChallengeDto } from './dtos/create.challenge.dto';
import { PlayersService } from 'src/players/players.service';
import { Player } from 'src/players/interfaces/player.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Challenge, Match } from './interfaces/challenge.interface';
// import { ChallengeStatus } from './interfaces/challenge.status.enum';
import { CategoriesService } from 'src/categories/categories.service';
import { ChallengeStatus } from './interfaces/challenge.status.enum';
import { UpdateChallengeDto } from './dtos/update.challenge.dto';
import { CreateMatchDto } from './dtos/create.match.dto';

@Injectable()
export class ChallengesService {
  private readonly logger = new Logger(ChallengesService.name);

  constructor(
    @InjectModel('Challenge') private readonly challengeModel: Model<Challenge>,
    @InjectModel('Match') private readonly matchModel: Model<Match>,

    private readonly player: PlayersService,
    private readonly categoryService: CategoriesService,
  ) {
    console.log('ChallengesService initialized');
    console.log('PlayerService:', !!this.player);
  }

  async createChallenge(payload: CreateChallengeDto): Promise<Challenge> {
    const { players, requester } = payload;

    try {
      await this.bothPlayersExistsOnBase(players);

      const requestingPlayer = players.find(
        (player) => player._id === payload.requester,
      );

      if (!requestingPlayer) {
        throw new BadRequestException(
          `The requesting player ${payload.requester} must be a part of the challenge players.`,
        );
      }

      const categoryOfPlayer =
        await this.categoryService.getCategoryByPlayer(requester);

      const createdChallenge = new this.challengeModel(payload);
      createdChallenge.category = categoryOfPlayer.category;
      createdChallenge.status = ChallengeStatus.PENDING;
      createdChallenge.dateTimeChallenge = new Date();

      return await createdChallenge.save();
    } catch (err) {
      this.logger.error(
        `Error during challenge creation: ${err.message || err} - Stack ${err.stack}`,
      );

      throw err;
    }
  }

  private async bothPlayersExistsOnBase(players: Player[]) {
    try {
      return await Promise.all(
        players.map((player) =>
          this.player.getPlayerById(player._id as string),
        ),
      );
    } catch (err) {
      // Criar uma instancia de erro
      this.logger.error(`Player doesnt exist on base ${err.stack}`);
    }
  }

  async getAllChallenges(): Promise<Challenge[]> {
    const allChallenges = await this.challengeModel
      .find()
      .populate('players')
      .populate('requester')
      .populate('match')
      .lean()
      .exec();

    return allChallenges.map((challenge) => ({
      ...challenge,
      dateTimeChallenge: new Date(
        challenge.dateTimeChallenge.setHours(
          challenge.dateTimeChallenge.getHours() - 3,
        ),
      ),
    }));
  }

  async deleteChallenge(_id: string): Promise<void> {
    const desafioEncontrado = await this.challengeModel.findById(_id).exec();

    if (!desafioEncontrado) {
      throw new BadRequestException(`Desafio ${_id} não cadastrado!`);
    }

    desafioEncontrado.status = ChallengeStatus.CANCELLED;

    await this.challengeModel
      .findOneAndUpdate({ _id }, { $set: desafioEncontrado })
      .exec();
  }

  async getPlayerChallenge(_id: string): Promise<Challenge[]> {
    return this.challengeModel
      .find()
      .where('players')
      .in(_id as any)
      .populate('players')
      .populate('match')
      .populate('requester')
      .exec();
  }

  async updateChallenge(
    _id: string,
    payload: UpdateChallengeDto,
  ): Promise<void> {
    const foundChallenge = await this.challengeModel.findById(_id).exec();

    if (!foundChallenge) {
      throw new BadRequestException(`Desafio ${_id} não cadastrado!`);
    }

    if (foundChallenge.status) {
      foundChallenge.dateTimeAnswer = new Date();
    }

    foundChallenge.status = payload.status;
    foundChallenge.dateTimeChallenge = payload.dateTimeChallenge;

    await this.challengeModel
      .findOneAndUpdate({ _id }, { $set: foundChallenge })
      .exec();
  }

  async createMatch(_id: string, payload: CreateMatchDto): Promise<void> {
    const foundChallenge = await this.challengeModel.findById(_id).exec();

    if (!foundChallenge) {
      throw new BadRequestException(`Desafio ${_id} não cadastrado!`);
    }

    const verifyIfWinnerPlayerIsOnMatch = foundChallenge.players.filter(
      (player) => {
        return player._id.toString() === payload.def.toString();
      },
    );

    // Parou aqui dando problema;
    // entender melhor o schema

    if (verifyIfWinnerPlayerIsOnMatch.length === 0) {
      throw new BadRequestException(
        `O jogador vencedor ${payload.def} não faz parte do desafio!`,
      );
    }

    const createdMatch = new this.matchModel(payload);
    createdMatch.category = foundChallenge.category;
    createdMatch.players = foundChallenge.players;
    const result = await createdMatch.save();

    foundChallenge.status = ChallengeStatus.COMPLETED;
    foundChallenge.match = result;

    try {
      await this.challengeModel
        .findOneAndUpdate({ _id }, { $set: foundChallenge })
        .exec();
    } catch (err) {
      await this.challengeModel.deleteOne({ id: result._id }).exec();
      throw new InternalServerErrorException();
    }
  }
}
