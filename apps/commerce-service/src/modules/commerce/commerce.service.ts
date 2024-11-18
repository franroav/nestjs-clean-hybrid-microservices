import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Commerce } from './models/commerce.model';

@Injectable()
export class CommerceService {
  private readonly logger = new Logger(CommerceService.name);

  constructor(
    @InjectModel(Commerce.name) private commerceModel: Model<Commerce>,
  ) {}

  async insertCommerce(commerce: any, idTrace: string, consumer: string) {
    try {
      const newCommerce = new this.commerceModel(commerce);
      const commerceSaved = await newCommerce.save();
      return { isResult: true, data: commerceSaved };
    } catch (error) {
      this.logError(error, idTrace, consumer);
      return { isResult: false, error: error.stack };
    }
  }

  async getCommerce(commerceId: string, idTrace: string, consumer: string) {
    try {
      const commerce = await this.commerceModel.findById(commerceId).exec();
      return { isResult: true, data: commerce };
    } catch (error) {
      this.logError(error, idTrace, consumer);
      return { isResult: false, error: error.stack };
    }
  }

  async updateCommerce(commerceId: string, commerce: any, idTrace: string, consumer: string) {
    try {
      const commerceUpdated = await this.commerceModel
        .findByIdAndUpdate(commerceId, commerce, { new: true })
        .exec();
      return { isResult: true, data: commerceUpdated };
    } catch (error) {
      this.logError(error, idTrace, consumer);
      return { isResult: false, error: error.stack };
    }
  }

  async deleteCommerce(commerceId: string, idTrace: string, consumer: string) {
    try {
      const commerceDeleted = await this.commerceModel.findByIdAndRemove(commerceId).exec();
      return { isResult: true, data: commerceDeleted };
    } catch (error) {
      this.logError(error, idTrace, consumer);
      return { isResult: false, error: error.stack };
    }
  }

  async getCommerceByApp(appId: string, idTrace: string, consumer: string) {
    try {
      const commerce = await this.commerceModel.findOne({ app: appId }).exec();
      return { isResult: true, data: commerce };
    } catch (error) {
      this.logError(error, idTrace, consumer);
      return { isResult: false, error: error.stack };
    }
  }

  async getCommerces(idTrace: string, consumer: string) {
    try {
      const commerces = await this.commerceModel.find().populate('app').exec();
      return { isResult: true, data: commerces };
    } catch (error) {
      this.logError(error, idTrace, consumer);
      return { isResult: false, error: error.stack };
    }
  }

  private logError(error: any, idTrace: string, consumer: string) {
    this.logger.error({
      timestamp: new Date(),
      idTrace,
      app: consumer,
      message: error.stack,
    });
  }
}
