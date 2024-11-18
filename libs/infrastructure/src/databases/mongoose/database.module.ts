import { Module, DynamicModule } from '@nestjs/common';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';

@Module({})
export class MongoDatabaseModule {
  static forRoot(uri: string, options?: MongooseModuleOptions): DynamicModule {
    return {
      module: MongoDatabaseModule,
      imports: [MongooseModule.forRoot(uri, options)],
    };
  }
}


// @Module({
//   imports: [ MongooseModule.forRoot(`${process.env.MONGODB_URI}`, {useNewUrlParser: true})],
//   controllers: [AppController],
//   providers: [AppService],
// })
// export class AppModule {}