import mongoose, { Mongoose } from 'mongoose';
import { getJsonSecret, getSecret } from '../../../../secrets/secret.service';

interface Secret {
  dataBase: {
    url: string;
    port: number;
    dataBase: string;
    user: string;
    pass: string;
  };
  dataBaseRead: {
    url: string;
    port: number;
  };
}

interface Config {
  [key: string]: any;
}

export default class DB {
  private secret: Secret;
  private config: Config;

  constructor() {
    this.secret = getJsonSecret() as Secret;
    const nodeEnv = process.env.NODE_ENV || 'development';
    this.config = ENV[nodeEnv];
  }

  public async getConnection(): Promise<Mongoose | void> {
    try {
      const principal = `${this.secret.dataBase.url}:${this.secret.dataBase.port}`;
      const read = `${this.secret.dataBaseRead.url}:${this.secret.dataBaseRead.port}`;
      const name = this.secret.dataBase.dataBase;
      const user = this.secret.dataBase.user;
      const pass = this.secret.dataBase.pass;

      console.log(this.secret);

      const conn = await mongoose.connect(
        `mongodb://${user}:${pass}@${principal}/${name}`,
        {
          // useNewUrlParser: true,
          // useUnifiedTopology: true,
          retryWrites: false,
          // poolSize: 20,
        }
      );
      return conn;
    } catch (e: any) {
      console.error("Error: " + e['stack']);
    }
  }
}
