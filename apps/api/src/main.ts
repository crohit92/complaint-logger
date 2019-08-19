/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 **/

import { NestFactory } from '@nestjs/core';
import { connect } from 'mongoose'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: console
    })
  );

  app.enableCors({
    origin: '*',
    methods: '*'
  });
  const globalPrefix = 'api/v1';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.port || 3333;
  await connect('mongodb+srv://gndu:iamhere_123@cluster0-m1vd2.mongodb.net/complaint-logger?retryWrites=true&w=majority', {
    useNewUrlParser: true
  });
  await app.listen(port, '0.0.0.0', () => {
    console.log('Listening at http://localhost:' + port + '/' + globalPrefix);
  });

}

bootstrap();
