import { Column, Table, Model, ForeignKey, Unique, BelongsTo } from 'sequelize-typescript';
import { Agricultor } from '../../agricultores/entities/agricultore.entity';

@Table({
  tableName: 'campos',
})
export class Campo extends Model {
  @Unique('nombre_ubicacion_unique')
  @Column
  nombre: string;

  @Unique('nombre_ubicacion_unique')
  @Column
  ubicacion: string;

  @ForeignKey(() => Agricultor)
  @Column
  agricultorId: number;

  @BelongsTo(() => Agricultor)
  agricultor: Agricultor;
}