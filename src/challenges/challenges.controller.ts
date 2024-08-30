import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateChallengeDto } from './dtos/create.challenge.dto';
import { ChallengesService } from './challenges.service';
import { Challenge } from './interfaces/challenge.interface';
import { ChallengeStatusPipeValidation } from './pipe/challenge.status.validation.pipe';
import { UpdateChallengeDto } from './dtos/update.challenge.dto';
import { CreateMatchDto } from './dtos/create.match.dto';

@Controller('api/v1/challenges')
export class ChallengesController {
  constructor(private readonly challengeService: ChallengesService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async create(@Body() body: CreateChallengeDto): Promise<Challenge> {
    try {
      return await this.challengeService.createChallenge(body);
    } catch (err) {
      throw err;
    }
  }

  @Get()
  async getAllChallenges() {
    return await this.challengeService.getAllChallenges();
  }

  @Get('player')
  async getPlayerChallenge(
    @Query('playerId') _id: string,
  ): Promise<Challenge[]> {
    return await this.challengeService.getPlayerChallenge(_id);
  }

  @Put('/:challengeId')
  async updateChallengeStatus(
    @Param('_id') _id: string,
    @Body(ChallengeStatusPipeValidation) updateChallengeDto: UpdateChallengeDto,
  ) {
    await this.challengeService.updateChallenge(_id, updateChallengeDto);
  }

  @Post('/:challengeId/match')
  async createMatch(
    @Param('challengeId') _id: string,
    @Body(ValidationPipe) createMatchDto: CreateMatchDto,
  ) {
    return await this.challengeService.createMatch(_id, createMatchDto);
  }
}
