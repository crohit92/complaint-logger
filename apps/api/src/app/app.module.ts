import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ComplaintsModule } from './complaints/complaints.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [ComplaintsModule, UsersModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule { }
