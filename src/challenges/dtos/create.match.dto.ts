import { IsNotEmpty } from 'class-validator';
import { Player } from 'src/players/interfaces/player.interface';
import { Result } from '../interfaces/challenge.interface';

export class CreateMatchDto {
  @IsNotEmpty()
  def: Player;

  @IsNotEmpty()
  result: Result[];
}
