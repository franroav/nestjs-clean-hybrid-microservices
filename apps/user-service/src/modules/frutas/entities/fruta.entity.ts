import { Column, Table, Model, Unique, HasMany } from 'sequelize-typescript';
import { Variedad } from '../../variedades/entities/variedade.entity';

@Table({
  tableName: 'frutas',
})
export class Fruta extends Model {
    @Unique
    @Column
    nombre?: string;
  
    @HasMany(() => Variedad)
    variedades?: Variedad[];
}