import { Controller, Post, Body, Get, Param, Put, Delete } from '@nestjs/common';
import { AppService } from './app.service';
import { App } from './interfaces/app.interface';

@Controller('apps')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  async createApp(@Body() app: App) {
    return this.appService.insertApp(app);
  }

  @Put(':id')
  async updateApp(@Param('id') id: string, @Body() app: App) {
    return this.appService.updateApp(id, app);
  }

  @Delete(':id')
  async deleteApp(@Param('id') id: string) {
    return this.appService.deleteApp(id);
  }

  @Get(':id')
  async getApp(@Param('id') id: string) {
    return this.appService.getApp(id);
  }

  @Get('/name/:name')
  async getAppByName(@Param('name') name: string) {
    return this.appService.getAppByName(name);
  }

  @Get()
  async getApps() {
    return this.appService.getApps();
  }
}
