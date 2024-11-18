import { Controller, Post, Put, Delete, Get, Param, Body } from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto, UpdateAccountDto } from './dto';

@Controller('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  async create(@Body() createAccountDto: CreateAccountDto, @Param('idTrace') idTrace: string, @Param('consumer') consumer: string) {
    return this.accountService.insertAccount(createAccountDto, idTrace, consumer);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateAccountDto: UpdateAccountDto, @Param('idTrace') idTrace: string, @Param('consumer') consumer: string) {
    return this.accountService.updateAccount(id, updateAccountDto, idTrace, consumer);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Param('idTrace') idTrace: string, @Param('consumer') consumer: string) {
    return this.accountService.deleteAccount(id, idTrace, consumer);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Param('idTrace') idTrace: string, @Param('consumer') consumer: string) {
    return this.accountService.getAccount(id, idTrace, consumer);
  }

  @Get('client/:clientId')
  async findByClient(@Param('clientId') clientId: string, @Param('idTrace') idTrace: string, @Param('consumer') consumer: string) {
    return this.accountService.getAccountsByClient(clientId, idTrace, consumer);
  }

  // Other endpoints follow a similar structure...
}
