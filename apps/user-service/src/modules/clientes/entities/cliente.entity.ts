import { Column, Table, Model, Unique } from 'sequelize-typescript';

@Table({
  tableName: 'clientes',
})
export class Cliente extends Model {
  
  @Column
  nombre?: string;

  @Unique
  @Column
  email?: string;

  // Constructor-based initialization
  constructor(nombre?: string, email?: string) {
    super(); // Call to the parent class constructor
    this.nombre = nombre;
    this.email = email;
  }
}
