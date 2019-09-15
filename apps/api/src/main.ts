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
import * as jwt from 'jsonwebtoken';
import { readFileSync } from 'fs';
import { environment } from './environments/environment';

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    {
      logger: console
    }
  );
  app.enableCors({
    origin: '*'
  });
  app.use((req, res, next) => {
    if (req.url.indexOf('login') === -1 && (environment.production ? true : (req.url.indexOf('complaints/delete') === -1))) {
      const headerValue = req.headers.authorization;
      if (headerValue && headerValue.length) {
        const token = headerValue.replace('Bearer ', '');
        const publicKey = readFileSync(__dirname + '/assets/public.pem');
        jwt.verify(token, publicKey, (err, decoded) => {
          if (err) {
            res.status(401).send({
              message: 'UnAuthorized'
            })
          } else {
            req.me = decoded;
            next();
          }
        })
      } else {
        res.status(401).send({
          message: 'UnAuthorized'
        })
      }
    } else {
      next();
    }
  })

  const globalPrefix = 'api/v1';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3333;
  await connect('mongodb+srv://gndu:iamhere_123@cluster0-m1vd2.mongodb.net/complaint-logger?retryWrites=true&w=majority', {
    useNewUrlParser: true
  });
  await app.listen(port, '0.0.0.0', () => {
    console.log('Listening at http://localhost:' + port + '/' + globalPrefix);
  });

}

bootstrap();
