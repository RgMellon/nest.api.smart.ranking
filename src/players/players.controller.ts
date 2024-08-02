import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { PlayersService } from './players.service';
import { Player } from './interfaces/player.interface';
import { PlayerValidationParamsPipe } from './pipes/player.validation.params.pipe';
import { UpdatePlayerDto } from './dtos/update-player.dto copy';

@Controller('api/v1/players')
export class PlayersController {
  constructor(private readonly playerService: PlayersService) {}
  @Post()
  @UsePipes(ValidationPipe)
  async createPlayer(@Body() body: CreatePlayerDto) {
    this.playerService.createPlayer(body);
  }

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  async updatePlayer(
    @Body() body: UpdatePlayerDto,
    @Param('_id', PlayerValidationParamsPipe) _id: string,
  ) {
    return await this.playerService.updatePlayer(_id, body);
  }

  @Get()
  async getAllPlayers(): Promise<Player[] | Player> {
    return await this.playerService.getAllPlayers();
  }

  @Get('/:_id')
  async getPlayerById(
    @Param('_id', PlayerValidationParamsPipe) _id: string,
  ): Promise<Player> {
    return await this.playerService.getPlayerById(_id);
  }

  @Delete('/:_id')
  async deletePlayer(@Param('_id', PlayerValidationParamsPipe) id: string) {
    await this.playerService.deletePlayer(id);
  }
}
