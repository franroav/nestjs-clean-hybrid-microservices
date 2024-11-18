import { Column, Table, Model, Unique, HasMany } from 'sequelize-typescript';
import { Campo } from '../../campos/entities/campo.entity';

@Table({
  tableName: 'agricultores',
})
export class Agricultor extends Model {
  @Column
  nombre?: string;

  @Unique
  @Column
  email?: string;

  // @HasMany(() => Campo)
  campos?: Campo[];

      // Constructor-based initialization
      // constructor(
      //   nombre: string,
      //   email: string,
      //   campos: Campo
      // ) {
      //   super()
      //   this.nombre = nombre;
      //   this.email = email;
      //   this.campos = [campos]
      // }
}