import { Column, Table, Model, Unique } from 'sequelize-typescript';

@Table({
  tableName: 'clientes',
})
export class Cliente extends Model {
  @Column
  nombre: string;

  @Unique
  @Column
  email: string;
}