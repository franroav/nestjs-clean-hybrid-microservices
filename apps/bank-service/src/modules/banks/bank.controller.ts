// apps/bank-service/src/bank.controller.ts
import { Controller, Post, Get, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { BankService } from './bank.service';
import { BankDto } from '@libs/shared/src/interfaces/bank.interface';

@Controller('banks')
export class BankController {
    constructor(private readonly bankService: BankService) {}

    @Post()
    async create(@Body() bankDto: BankDto, @Query('idTrace') idTrace: string, @Query('consumer') consumer: string) {
        return this.bankService.insertBank(bankDto, idTrace, consumer);
    }

    @Put(':id')
    async update(@Param('id') bankId: string, @Body() bankDto: BankDto, @Query('idTrace') idTrace: string, @Query('consumer') consumer: string) {
        return this.bankService.updateBank(bankId, bankDto, idTrace, consumer);
    }

    @Delete(':id')
    async delete(@Param('id') bankId: string, @Query('idTrace') idTrace: string, @Query('consumer') consumer: string) {
        return this.bankService.deleteBank(bankId, idTrace, consumer);
    }

    @Get(':id')
    async findOne(@Param('id') bankId: string, @Query('idTrace') idTrace: string, @Query('consumer') consumer: string) {
        return this.bankService.getBank(bankId, idTrace, consumer);
    }

    @Get('code/:code')
    async findByCode(@Param('code') bankCode: string, @Query('idTrace') idTrace: string, @Query('consumer') consumer: string) {
        return this.bankService.getBankByCode(bankCode, idTrace, consumer);
    }

    @Get()
    async findAll(@Query('idTrace') idTrace: string, @Query('consumer') consumer: string) {
        return this.bankService.getBanks(idTrace, consumer);
    }
}
