

import mysql, { Connection } from 'mysql';

class Db {
  private connection: Connection;

  constructor() {
    console.log(`*************SE CREA CONEXION A LA DB *************`);

    this.connection = mysql.createConnection({
      host: "xxxxxxxxxxx",
      user: "xxxxxxxxxxxx",
      password: "xxxxxxxxxxxx",
      port: 3306,
      database: "xxxxxxxxxxxx",
    });
  }

  getConnection(): Connection {
    return this.connection;
  }
}

export default new Db();

