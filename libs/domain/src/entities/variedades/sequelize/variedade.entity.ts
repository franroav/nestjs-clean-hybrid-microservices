import { Column, Table, Model, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Fruta } from '../../frutas/entities/fruta.entity';

@Table({
  tableName: 'variedades',
})
export class Variedad extends Model {
    @Column
    nombre: string;

    @ForeignKey(() => Fruta)
    @Column
    frutaId: number;

    @BelongsTo(() => Fruta)
    fruta: Fruta;
}