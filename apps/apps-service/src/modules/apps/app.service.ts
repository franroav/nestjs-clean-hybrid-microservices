import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { App, AppDocument } from './models/app.model';

@Injectable()
export class AppService {
  constructor(@InjectModel(App.name) private appModel: Model<AppDocument>) {}

  async insertApp(app: App): Promise<any> {
    try {
      const newApp = new this.appModel(app);
      return { isResult: true, data: await newApp.save() };
    } catch (error) {
      // Log error here if needed
      return { isResult: false, error: error.stack };
    }
  }

  async updateApp(appId: string, app: App): Promise<any> {
    try {
      const updatedApp = await this.appModel.findByIdAndUpdate(appId, app, {
        new: true,
      });
      return { isResult: true, data: updatedApp };
    } catch (error) {
      // Log error here if needed
      return { isResult: false, error: error.stack };
    }
  }

  async deleteApp(appId: string): Promise<any> {
    try {
      const deletedApp = await this.appModel.findByIdAndRemove(appId);
      return { isResult: true, data: deletedApp };
    } catch (error) {
      // Log error here if needed
      return { isResult: false, error: error.stack };
    }
  }

  async getApp(appId: string): Promise<any> {
    try {
      const app = await this.appModel.findById(appId);
      return { isResult: true, data: app };
    } catch (error) {
      // Log error here if needed
      return { isResult: false, error: error.stack };
    }
  }

  async getAppByName(name: string): Promise<any> {
    try {
      const app = await this.appModel.findOne({ name });
      return { isResult: true, data: app };
    } catch (error) {
      // Log error here if needed
      return { isResult: false, error: error.stack };
    }
  }

  async getApps(): Promise<any> {
    try {
      const apps = await this.appModel.find();
      return { isResult: true, data: apps };
    } catch (error) {
      // Log error here if needed
      return { isResult: false, error: error.stack };
    }
  }
}
