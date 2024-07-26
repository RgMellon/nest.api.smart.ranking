import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { PlayersService } from './players.service';
import { Player } from './interfaces/player.interface';
import { PlayerValidationParamsPipe } from './pipes/player.validation.params.pipe';

@Controller('api/v1/players')
export class PlayersController {
  constructor(private readonly playerService: PlayersService) {}
  @Post()
  @UsePipes(ValidationPipe)
  async createUpdatePlayer(@Body() body: CreatePlayerDto) {
    this.playerService.createUpdatePlayer(body);
  }

  @Get()
  async getAllPlayers(
    @Query('email', PlayerValidationParamsPipe) email: string,
  ): Promise<Player[] | Player> {
    if (!email) {
      return await this.playerService.getAllPlayers();
    }

    return await this.playerService.getPlayerByEmail(email);
  }

  @Delete()
  async deletePlayer(@Query('id') id: string) {
    await this.playerService.deletePlayer(id);
  }
}
