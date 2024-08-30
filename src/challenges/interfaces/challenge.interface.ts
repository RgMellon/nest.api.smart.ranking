import { Document } from 'mongoose';
import { ChallengeStatus } from './challenge.status.enum';
import { Player } from 'src/players/interfaces/player.interface';

export interface Challenge extends Document {
  dateTimeChallenge: Date;
  status: ChallengeStatus;
  dateTimeRequest: Date;
  dateTimeAnswer: Date;
  requester: Player;
  category: string;
  players: Player[];
  match: Match;
}

export interface Match extends Document {
  category: string;
  players: Player[];
  def: Player;
  score: Result[];
}

export interface Result {
  set: string;
}
