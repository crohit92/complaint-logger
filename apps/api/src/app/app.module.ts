import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ComplaintsModule } from './complaints/complaints.module';
import { UsersModule } from './users/users.module';
import * as dotenv from 'dotenv';
dotenv.config({
  path: `${__dirname}/assets/.env`
});
@Module({
  imports: [ComplaintsModule, UsersModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
