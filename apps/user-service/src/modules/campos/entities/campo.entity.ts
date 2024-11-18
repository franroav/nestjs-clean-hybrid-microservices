import { Column, Table, Model, ForeignKey, Unique, BelongsTo } from 'sequelize-typescript';
import { Agricultor } from '../../agricultores/entities/agricultore.entity';

@Table({
  tableName: 'campos',
})

export class Campo extends Model<Campo> {
  @Unique('nombre_ubicacion_unique')
  @Column
  nombre: string;

  @Unique('nombre_ubicacion_unique')
  @Column
  ubicacion: string;

  // @ForeignKey(() => Agricultor)
  @ForeignKey(() => Agricultor)
  @Column
  agricultorId: number;

  // @BelongsTo(() => Agricultor)
  @BelongsTo(() => Agricultor, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  agricultor: Agricultor;

  // Constructor-based initialization
  constructor(
    nombre: string,
    ubicacion: string,
    agricultorId: number,
    agricultor: Agricultor
  ) {
    super(); // Call to the parent class constructor
    this.nombre = nombre;
    this.ubicacion = ubicacion;
    this.agricultorId = agricultorId;
    this.agricultor = agricultor;
  }
}




// export class Campo extends Model<Campo> {
//   @Unique('nombre_ubicacion_unique')
//   @Column
//   nombre?: string;

//   @Unique('nombre_ubicacion_unique')
//   @Column
//   ubicacion?: string;

//   @ForeignKey(() => Agricultor)
//   @Column
//   agricultorId?: number;

//   @BelongsTo(() => Agricultor)
//   agricultor?: Agricultor;
// }
