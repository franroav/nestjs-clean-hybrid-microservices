import { Controller, Post, Get, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { CommerceService } from './commerce.service';

@Controller('commerce')
export class CommerceController {
  constructor(private readonly commerceService: CommerceService) {}

  @Post()
  async create(@Body() commerce: any, @Query('idTrace') idTrace: string, @Query('consumer') consumer: string) {
    return this.commerceService.insertCommerce(commerce, idTrace, consumer);
  }

  @Get(':id')
  async findOne(@Param('id') commerceId: string, @Query('idTrace') idTrace: string, @Query('consumer') consumer: string) {
    return this.commerceService.getCommerce(commerceId, idTrace, consumer);
  }

  @Put(':id')
  async update(@Param('id') commerceId: string, @Body() commerce: any, @Query('idTrace') idTrace: string, @Query('consumer') consumer: string) {
    return this.commerceService.updateCommerce(commerceId, commerce, idTrace, consumer);
  }

  @Delete(':id')
  async remove(@Param('id') commerceId: string, @Query('idTrace') idTrace: string, @Query('consumer') consumer: string) {
    return this.commerceService.deleteCommerce(commerceId, idTrace, consumer);
  }

  @Get('app/:appId')
  async findByApp(@Param('appId') appId: string, @Query('idTrace') idTrace: string, @Query('consumer') consumer: string) {
    return this.commerceService.getCommerceByApp(appId, idTrace, consumer);
  }

  @Get()
  async findAll(@Query('idTrace') idTrace: string, @Query('consumer') consumer: string) {
    return this.commerceService.getCommerces(idTrace, consumer);
  }
}
