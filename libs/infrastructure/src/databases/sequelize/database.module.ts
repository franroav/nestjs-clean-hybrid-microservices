import { Module, DynamicModule } from '@nestjs/common';
import { SequelizeModule, SequelizeModuleOptions } from '@nestjs/sequelize';

@Module({})
export class SequelizeDatabaseModule {
  static forRoot(options: SequelizeModuleOptions): DynamicModule {
    return {
      module: SequelizeDatabaseModule,
      imports: [SequelizeModule.forRoot(options)],
    };
  }
}


// @Module({
//   imports: [ MongooseModule.forRoot(`${process.env.MONGODB_URI}`, {useNewUrlParser: true})],
//   controllers: [AppController],
//   providers: [AppService],
// })
// export class AppModule {}