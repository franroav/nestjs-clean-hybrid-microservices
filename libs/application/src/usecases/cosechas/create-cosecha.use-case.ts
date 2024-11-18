import { Cosecha } from '@app/domain/entities/cosechas/sequelize/cosecha.entity';
import { CosechasDataAccessObject } from '@app/shared/dao/mongodb/cosechas/cosechas.dao';

export class CreateCosechaUseCase {
  constructor(private readonly cosechaRepository: CosechasDataAccessObject) {}

  async execute(frutaId: number, variedadeId: number, agricultorId: number, campoId: number,  cantidad: number): Promise<Cosecha> {
    // For demonstration purposes, generating random IDs for fruta, variedade, agricultor, and campo.
    // In a real case, these would likely come from lookup or creation logic.
    // const frutaId = Math.floor(Math.random() * 100);
    // const variedadeId = Math.floor(Math.random() * 100);
    // const agricultorId = Math.floor(Math.random() * 100);
    // const campoId = Math.floor(Math.random() * 100);
    
    // Generating a random quantity and setting the current date for fechaCosecha
    // const cantidad = Math.floor(Math.random() * 1000);
    const fechaCosecha = new Date();
    
    // Creating a new Cosecha instance and setting its attributes
    const cosecha = new Cosecha();
    cosecha.frutaId = frutaId;
    cosecha.variedadeId = variedadeId;
    cosecha.agricultorId = agricultorId;
    cosecha.campoId = campoId;
    cosecha.fechaCosecha = fechaCosecha;
    cosecha.cantidad = cantidad;

    // Assuming name and email correspond to attributes of related entities (e.g., Agricultor)
    // This part of the logic would depend on the business case and actual relationships.

    // Save the new cosecha instance in the repository
    await this.cosechaRepository.save(cosecha);

    return cosecha;
  }
}
