/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 **/

import { NestFactory } from '@nestjs/core';
import { connect } from 'mongoose';
import { AppModule } from './app/app.module';
import { Authenticate } from './app/middlewares/auth.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: console
  });
  app.enableCors({
    origin: '*'
  });
  app.use(Authenticate);

  const globalPrefix = 'api/v1';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 80;
  await connect(
    'mongodb://localhost:27017',
    {
      useNewUrlParser: true,
      dbName: 'complaint-logger'
    }
  );
  await app.listen(port, '0.0.0.0', () => {
    console.log('Listening at http://localhost:' + port + '/' + globalPrefix);
  });
}

bootstrap();
