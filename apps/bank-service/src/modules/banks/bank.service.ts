// apps/bank-service/src/bank.service.ts
import { Injectable } from '@nestjs/common';
import { BankDao } from '@libs/shared/src/dao/mongodb/payment/bank.dao';
import { BankDto } from '@libs/shared/src/interfaces/bank.interface';

@Injectable()
export class BankService {
    constructor(private readonly bankDao: BankDao) {}

    async insertBank(bankDto: BankDto, idTrace: string, consumer: string) {
        return this.bankDao.insertBank(bankDto, idTrace, consumer);
    }

    async updateBank(bankId: string, bankDto: BankDto, idTrace: string, consumer: string) {
        return this.bankDao.updateBank(bankId, bankDto, idTrace, consumer);
    }

    async deleteBank(bankId: string, idTrace: string, consumer: string) {
        return this.bankDao.deleteBank(bankId, idTrace, consumer);
    }

    async getBank(bankId: string, idTrace: string, consumer: string) {
        return this.bankDao.getBank(bankId, idTrace, consumer);
    }

    async getBankByCode(bankCode: string, idTrace: string, consumer: string) {
        return this.bankDao.getBankByCode(bankCode, idTrace, consumer);
    }

    async getBanks(idTrace: string, consumer: string) {
        return this.bankDao.getBanks(idTrace, consumer);
    }
}
