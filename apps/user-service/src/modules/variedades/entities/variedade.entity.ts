import { Column, Table, Model, ForeignKey, BelongsTo, Repository } from 'sequelize-typescript';
import { Fruta } from '../../frutas/entities/fruta.entity';

@Table({
  tableName: 'variedades',
})
export class Variedad extends Model {
    @Column
    nombre?: string;

    @ForeignKey(() => Fruta)
    @Column
    frutaId?: number;

    @BelongsTo(() => Fruta)
    fruta?: Fruta;


      // Constructor-based initialization
  // constructor(
  //   nombre: string,
  //   frutaId: number,
  //   fruta?: Fruta,
  // ) {
  //   super(); // Call to the parent class constructor
  //   this.frutaId = frutaId;
  //   this.fruta = fruta || new Fruta();
  //   this.nombre = nombre;
  // }
}