import { Module } from '@nestjs/common';
import { PlayersModule } from './players/players.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesModule } from './categories/categories.module';

const connectionMoongoose =
  'mongodb+srv://rgmelo94:qDcOSHhQrrtSdO6e@cluster0.q9qgq6n.mongodb.net/smartranking?retryWrites=true&w=majority&appName=Cluster0';

@Module({
  imports: [PlayersModule, MongooseModule.forRoot(connectionMoongoose), CategoriesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
