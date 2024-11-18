import { Controller, Get, Query } from '@nestjs/common';
import { TransferService } from './transfer.service';

@Controller('transfers')
export class TransferController {
  constructor(private readonly transferService: TransferService) {}

  @Get('transactions')
  async getTransactions(
    @Query('status') status: string,
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('appName') appName: string,
    @Query('orderId') orderId: string,
    @Query('limit') limit: number = 1000,
    @Query('page') page: number = 1,
  ) {
    const filter = { status, from, to, appName, orderId };
    return this.transferService.getBankferTransactions(filter, limit, page);
  }

  @Get('count')
  async countTransfers(
    @Query('status') status: string,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    const filter = { status, from, to };
    return this.transferService.countTransferByFilters(filter);
  }
}
