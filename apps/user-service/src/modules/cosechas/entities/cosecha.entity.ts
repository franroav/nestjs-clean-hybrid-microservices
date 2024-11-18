import { Column, Table, Model, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Fruta } from '../../frutas/entities/fruta.entity';
import { Variedad } from '../../variedades/entities/variedade.entity';
import { Agricultor } from '../../agricultores/entities/agricultore.entity';
import { Campo } from '../../campos/entities/campo.entity';

@Table({
  tableName: 'cosechas',
})
export class Cosecha extends Model<Cosecha> {
  @ForeignKey(() => Fruta)
  @Column
  frutaId?: number;

  @ForeignKey(() => Variedad)
  @Column
  variedadeId?: number;

  // @ForeignKey(() => Agricultor)
  @Column
  agricultorId?: number;

  // @ForeignKey(() => Campo)
  @Column
  campoId?: number;

  @Column
  fechaCosecha?: Date;

  @Column
  cantidad?: number;

  @BelongsTo(() => Fruta)
  fruta?: Fruta;

  @BelongsTo(() => Variedad)
  variedade?: Variedad;

  // @BelongsTo(() => Agricultor)
  agricultor?: Agricultor;

  // @BelongsTo(() => Campo)
  campo?: Campo;

  // Constructor-based initialization
  // constructor(
  //   frutaId: number,
  //   variedadeId: number,
  //   agricultorId: number,
  //   campoId: number,
  //   fechaCosecha: Date,
  //   cantidad: number,
  //   fruta?: Fruta,
  //   variedade?: Variedad,
  //   agricultor?: Agricultor,
  //   campo?: Campo
  // ) {
  //   super(); // Call to the parent class constructor
  //   this.frutaId = frutaId;
  //   this.variedadeId = variedadeId;
  //   this.agricultorId = agricultorId;
  //   this.campoId = campoId;
  //   this.fechaCosecha = fechaCosecha;
  //   this.cantidad = cantidad;
  //   this.fruta = fruta || new Fruta();
  //   this.variedade = variedade || new Variedad();
  //   this.agricultor = agricultor;
  //   this.campo = campo;
  // }
}


