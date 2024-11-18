// libs/shared/src/dao/mongodb/payment/bank.dao.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Bank } from '../models/bank.model';
import { BankDto, BankResponse } from '../interfaces/bank.interface';

@Injectable()
export class BankDao {
    constructor(@InjectModel(Bank.name) private readonly bankModel: Model<Bank>) {}

    async insertBank(bankDto: BankDto, idTrace: string, consumer: string): Promise<BankResponse> {
        const newBank = new this.bankModel(bankDto);
        try {
            const bankSaved = await newBank.save();
            return { isResult: true, data: bankSaved };
        } catch (error) {
            Logger.info("", {
                timestamp: new Date(),
                idTrace: idTrace,
                app: consumer,
                service: 'BankService',
                type: 'error',
                object: 'bank',
                action: 'insert',
                log: error.stack
            });
            return { isResult: false, error: error.message };
        }
    }

    async updateBank(bankId: string, bankDto: BankDto, idTrace: string, consumer: string): Promise<BankResponse> {
        try {
            const bankUpdated = await this.bankModel.findByIdAndUpdate(bankId, bankDto, { new: true });
            return { isResult: true, data: bankUpdated };
        } catch (error) {
            Logger.info("", {
                timestamp: new Date(),
                idTrace: idTrace,
                app: consumer,
                service: 'BankService',
                type: 'error',
                object: 'bank',
                action: 'update',
                log: error.stack
            });
            return { isResult: false, error: error.message };
        }
    }

    async deleteBank(bankId: string, idTrace: string, consumer: string): Promise<BankResponse> {
        try {
            const bankDeleted = await this.bankModel.findByIdAndRemove(bankId);
            return { isResult: true, data: bankDeleted };
        } catch (error) {
            Logger.info("", {
                timestamp: new Date(),
                idTrace: idTrace,
                app: consumer,
                service: 'BankService',
                type: 'error',
                object: 'bank',
                action: 'delete',
                log: error.stack
            });
            return { isResult: false, error: error.message };
        }
    }

    async getBank(bankId: string, idTrace: string, consumer: string): Promise<BankResponse> {
        try {
            const bank = await this.bankModel.findById(bankId);
            return { isResult: true, data: bank };
        } catch (error) {
            Logger.info("", {
                timestamp: new Date(),
                idTrace: idTrace,
                app: consumer,
                service: 'BankService',
                type: 'error',
                object: 'bank',
                action: 'get',
                log: error.stack
            });
            return { isResult: false, error: error.message };
        }
    }

    async getBankByCode(bankCode: string, idTrace: string, consumer: string): Promise<BankResponse> {
        try {
            const bank = await this.bankModel.findOne({ code: bankCode });
            return { isResult: true, data: bank };
        } catch (error) {
            Logger.info("", {
                timestamp: new Date(),
                idTrace: idTrace,
                app: consumer,
                service: 'BankService',
                type: 'error',
                object: 'bank',
                action: 'getByCode',
                log: error.stack
            });
            return { isResult: false, error: error.message };
        }
    }

    async getBanks(idTrace: string, consumer: string): Promise<BankResponse> {
        try {
            const banks = await this.bankModel.find().select({ name: 1, code: 1, _id: 0 });
            return { isResult: true, data: banks };
        } catch (error) {
            Logger.info("", {
                timestamp: new Date(),
                idTrace: idTrace,
                app: consumer,
                service: 'BankService',
                type: 'error',
                object: 'bank',
                action: 'getAll',
                log: error.stack
            });
            return { isResult: false, error: error.message };
        }
    }
}
