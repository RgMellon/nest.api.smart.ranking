import { Module } from '@nestjs/common';
import { PlayersModule } from './players/players.module';
import { MongooseModule } from '@nestjs/mongoose';

const connectionMoongoose =
  'mongodb+srv://rgmelo94:qDcOSHhQrrtSdO6e@cluster0.q9qgq6n.mongodb.net/smartranking?retryWrites=true&w=majority&appName=Cluster0';

@Module({
  imports: [PlayersModule, MongooseModule.forRoot(connectionMoongoose)],
  controllers: [],
  providers: [],
})
export class AppModule {}
