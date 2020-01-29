import { Controller, Get, Render } from '@nestjs/common';

import { AppService } from './app.service';
import { OpenEndpoint } from './utils/open-endpoint.helper';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get(OpenEndpoint('ping'))
  ping() {
    return;
  }
  @Get()
  @Render('index')
  index() {}
}
