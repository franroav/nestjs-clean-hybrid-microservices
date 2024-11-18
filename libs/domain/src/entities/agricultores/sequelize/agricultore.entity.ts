import { Column, Table, Model, Unique, HasMany } from 'sequelize-typescript';
import { Campo } from '../../campos/entities/campo.entity';

@Table({
  tableName: 'agricultores',
})
export class Agricultor extends Model {
  @Column
  nombre: string;

  @Unique
  @Column
  email: string;

  @HasMany(() => Campo)
  campos: Campo[];
}