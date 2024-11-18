import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Account, AccountDocument } from './models/account.model';
import { Logger } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Injectable()
export class AccountService {
  private readonly logger = new Logger(AccountService.name);

  constructor(
    @InjectModel(Account.name) private accountModel: Model<AccountDocument>,
  ) {}

  async insertAccount(account: CreateAccountDto, idTrace: string, consumer: string) {
    try {
      const newAccount = new this.accountModel(account);
      const accountSaved = await newAccount.save();
      return { isResult: true, data: accountSaved };
    } catch (err) {
      this.logError(idTrace, consumer, err);
      return { isResult: false, error: err.stack };
    }
  }

  async updateAccount(accountId: string, account: UpdateAccountDto, idTrace: string, consumer: string) {
    try {
      const accountUpdated = await this.accountModel.findByIdAndUpdate(accountId, account, { new: true }).exec();
      return { isResult: true, data: accountUpdated };
    } catch (err) {
      this.logError(idTrace, consumer, err);
      return { isResult: false, error: err.stack };
    }
  }

  async deleteAccount(accountId: string, idTrace: string, consumer: string) {
    try {
      const accountDeleted = await this.accountModel.findByIdAndUpdate(accountId, { isDelete: true }, { new: true }).exec();
      return { isResult: true, data: accountDeleted };
    } catch (err) {
      this.logError(idTrace, consumer, err);
      return { isResult: false, error: err.stack };
    }
  }

  async getAccount(accountId: string, idTrace: string, consumer: string) {
    try {
      const account = await this.accountModel.findOne({ _id: accountId, isDelete: false }).populate('bank').exec();
      return { isResult: true, data: account };
    } catch (err) {
      this.logError(idTrace, consumer, err);
      return { isResult: false, error: err.stack };
    }
  }

  async getAccountsByClient(clientId: string, idTrace: string, consumer: string) {
    try {
      const accounts = await this.accountModel.find({ client: clientId, isDelete: false })
        .populate('bank', '-_id name code')
        .populate('app', 'name sharedAccounts')
        .sort({ addedAt: -1 })
        .exec();
      return { isResult: true, data: accounts };
    } catch (err) {
      this.logError(idTrace, consumer, err);
      return { isResult: false, error: err.stack };
    }
  }

  // Other methods follow a similar structure...

  private logError(idTrace: string, consumer: string, err: any) {
    this.logger.error({
      timestamp: new Date(),
      idTrace,
      app: consumer,
      service: 'AccountService',
      log: err.stack,
    });
  }
}
