import * as Moongose from 'mongoose';

export const ChallengeSchema = new Moongose.Schema(
  {
    dateTimeChallenge: { type: Date },
    status: { type: String },
    dateTimeRequest: { type: Date },
    dateTimeAnswer: { type: Date },
    requester: { type: Moongose.Schema.Types.ObjectId, ref: 'Player' },
    category: { type: String },
    players: [
      {
        type: Moongose.Schema.Types.ObjectId,
        ref: 'Player',
      },
    ],
    match: { type: Moongose.Schema.Types.ObjectId, ref: 'Match' },
  },
  {
    timestamps: true,
    collection: 'challenges',
  },
);
