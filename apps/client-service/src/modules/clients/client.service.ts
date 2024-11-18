import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Client } from '../libs/shared/src/models/client.model';
import { CreateClientDto, UpdateClientDto } from './dto/client.dto'; // Define these DTOs

@Injectable()
export class ClientService {
    private readonly logger = new Logger(ClientService.name);

    constructor(@InjectModel('Client') private readonly clientModel: Model<Client>) {}

    async insertClient(clientDto: CreateClientDto, idTrace: string, consumer: string) {
        try {
            const newClient = new this.clientModel(clientDto);
            const clientSaved = await newClient.save();
            return { isResult: true, data: clientSaved };
        } catch (error) {
            this.logError(idTrace, consumer, error);
            return { isResult: false, error: error.message };
        }
    }

    async updateClient(clientId: string, clientDto: UpdateClientDto, idTrace: string, consumer: string) {
        try {
            const clientUpdated = await this.clientModel.findByIdAndUpdate(clientId, clientDto, { new: true });
            return { isResult: true, data: clientUpdated };
        } catch (error) {
            this.logError(idTrace, consumer, error);
            return { isResult: false, error: error.message };
        }
    }

    async deleteClient(clientId: string, idTrace: string) {
        try {
            const clientDeleted = await this.clientModel.findByIdAndRemove(clientId);
            return { isResult: true, data: clientDeleted };
        } catch (error) {
            this.logger.error(`Error deleting client: ${error.message}`);
            return { isResult: false, error: error.message };
        }
    }

    async getClient(clientId: string, idTrace: string, consumer: string) {
        try {
            const client = await this.clientModel.findById(clientId);
            if (client) {
                return { isResult: true, data: client };
            }
            return { isResult: false };
        } catch (error) {
            this.logError(idTrace, consumer, error);
            return { isResult: false, error: error.message };
        }
    }

    // Similar methods for getClientByCommerceUserIdAndApp, getClientByEmail, etc.

    private logError(idTrace: string, consumer: string, error: Error) {
        this.logger.error(`Trace ID: ${idTrace} | Consumer: ${consumer} | Error: ${error.stack}`);
    }
}
