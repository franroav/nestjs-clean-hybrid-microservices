import { Sequelize } from 'sequelize-typescript';
import { Fruta } from '../../../../apps/user-service/src/modules/frutas/entities/fruta.entity';
import { Variedad } from '../../../../apps/user-service/src/modules/variedades/entities/variedade.entity';
import { Agricultor } from '../../../../apps/user-service/src/modules/agricultores/entities/agricultore.entity';
import { Campo } from '../../../../apps/user-service/src/modules/campos/entities/campo.entity';
import { Cliente } from '../../../../apps/user-service/src/modules/clientes/entities/cliente.entity';
import { Cosecha } from '../../../../apps/user-service/src/modules/cosechas/entities/cosecha.entity';
import { faker } from '@faker-js/faker';

async function dropTables(sequelize: Sequelize) {
  try {
    // Disable foreign key checks (if using SQLite)
    await sequelize.query('PRAGMA foreign_keys = OFF');

    // Drop tables manually to handle foreign key constraints
    await sequelize.query('DROP TABLE IF EXISTS campos');
    await sequelize.query('DROP TABLE IF EXISTS clientes');
    await sequelize.query('DROP TABLE IF EXISTS cosechas');
    await sequelize.query('DROP TABLE IF EXISTS agricultores');
    await sequelize.query('DROP TABLE IF EXISTS variedades');
    await sequelize.query('DROP TABLE IF EXISTS frutas');

    // Re-enable foreign key checks
    await sequelize.query('PRAGMA foreign_keys = ON');
  } catch (error) {
    console.error('Error during dropping tables: ', error);
    throw error;
  }
}

export async function seedDatabase(sequelize: Sequelize) {
  try {
    // Start a transaction
    const transaction = await sequelize.transaction();

    // Drop tables manually to handle foreign key constraints
    await dropTables(sequelize);

    // Sync the database
    await sequelize.sync({ force: true });


  // Crear Frutas y Variedades
  for (let i = 0; i < 10; i++) {
    let fruta = await Fruta.create({
      nombre: faker.word.noun(),
    }, { transaction });

    for (let j = 0; j < 3; j++) {
      await Variedad.create({
        nombre: faker.word.noun(),
        frutaId: fruta.id,
      }, { transaction });
    }
  }

      //Create Clientes
    // for (let i = 0; i < 10; i++) {
    //   await Cliente.create({
    //     nombre: faker.person.firstName(),
    //     email: faker.internet.email(),
    //   }, { transaction });
    // }


  // for (let i = 0; i < 10; i++) {
  //   let variedades = []
  //   let fruta = await Fruta.create({
  //     nombre: faker.random.word(),
  //     variedad: variedades
  //   });

  //   for (let j = 0; j < 3; j++) {
  //   await Variedad.create({
  //       nombre: faker.random.word(),
  //       frutaId: fruta.id,
  //     });
  //   }
  //   variedades.push({nombre: faker.random.word(),
  //     frutaId: fruta.id})
  //     // console.log("fruta", fruta)
  // }

  // Crear Agricultores y Campos
  // for (let i = 0; i < 5; i++) {
  //   const agricultor = await Agricultor.create({
  //     nombre: faker.name.firstName(),
  //     email: faker.internet.email(),
  //   });

  //   for (let j = 0; j < 2; j++) {
  //     await Campo.create({
  //       nombre: faker.address.streetName(),
  //       ubicacion: faker.address.city(),
  //       agricultorId: agricultor.id,
  //     });
  //   }
  // }

  // Crear Clientes
  // for (let i = 0; i < 10; i++) {
  //   await Cliente.create({
  //     nombre: faker.name.firstName(),
  //     email: faker.internet.email(),
  //   });
  // }

  // Crear Cosechas
  // for (let i = 0; i < 20; i++) {
  //   await Cosecha.create({
  //     fecha: faker.date.past(),
  //     frutaId: faker.datatype.number({ min: 1, max: 10 }),
  //     campoId: faker.datatype.number({ min: 1, max: 10 }),
  //     // agricultorId: faker.datatype.number({ min: 1, max: 10 }),
  //     // variedadeId: faker.datatype.number({ min: 1, max: 10 }),
  //     // fechaCosecha: faker.date.recent(),
  //   });
  // }




    // Create Frutas and Variedades
    // for (let i = 0; i < 10; i++) {
    //   let fruta = await Fruta.create({
    //     nombre: faker.word.noun(),
    //   }, { transaction });

    //   for (let j = 0; j < 3; j++) {
    //     await Variedad.create({
    //       nombre: faker.word.noun(),
    //       frutaId: fruta.id,
    //     }, { transaction });
    //   }
    // }

    // Create Agricultores and Campos
    // for (let i = 0; i < 5; i++) {
    //   const agricultor = await Agricultor.create({
    //     nombre: faker.person.firstName(),
    //     email: faker.internet.email(),
    //   }, { transaction });

    //   // for (let j = 0; j < 2; j++) {
    //   //   await Campo.create({
    //   //     nombre: faker.location.street(),
    //   //     ubicacion: faker.location.city(),
    //   //     agricultorId: agricultor.id,
    //   //   }, { transaction });
    //   // }
    // }

    // Create Clientes
    // for (let i = 0; i < 10; i++) {
    //   await Cliente.create({
    //     nombre: faker.person.firstName(),
    //     email: faker.internet.email(),
    //   }, { transaction });
    // }

    // Commit the transaction
    await transaction.commit();
  } catch (error) {
    console.error('Error during seeding: ', error);
    throw error;
  }
}




// import { Sequelize } from 'sequelize-typescript';
// import { Fruta } from '../../../../apps/user-service/src/modules/frutas/entities/fruta.entity';
// import { Variedad } from '../../../../apps/user-service/src/modules/variedades/entities/variedade.entity';
// import { Agricultor } from '../../../../apps/user-service/src/modules/agricultores/entities/agricultore.entity';
// import { Campo } from '../../../../apps/user-service/src/modules/campos/entities/campo.entity';
// import { Cliente } from '../../../../apps/user-service/src/modules/clientes/entities/cliente.entity';
// import { Cosecha } from '../../../../apps/user-service/src/modules/cosechas/entities/cosecha.entity';
// import { faker } from '@faker-js/faker';

// export async function seedDatabase(sequelize: Sequelize) {
//   try {
//     // Start a transaction
//     const transaction = await sequelize.transaction();

//     await sequelize.sync({ force: true });

//     // Crear Frutas y Variedades
//     for (let i = 0; i < 10; i++) {
//       let fruta = await Fruta.create({
//         nombre: faker.word.noun(),
//       }, { transaction });

//       for (let j = 0; j < 3; j++) {
//         await Variedad.create({
//           nombre: faker.word.noun(),
//           frutaId: fruta.id,
//         }, { transaction });
//       }
//     }

//     // Crear Agricultores y Campos
//     for (let i = 0; i < 5; i++) {
//       const agricultor = await Agricultor.create({
//         nombre: faker.person.firstName(),
//         email: faker.internet.email(),
//       }, { transaction });

//       // for (let j = 0; j < 2; j++) {
//       //   await Campo.create({
//       //     nombre: faker.location.street(),
//       //     ubicacion: faker.location.city(),
//       //     agricultorId: agricultor.id, // Ensure this ID matches
//       //   });
//       // }
//     }

//     // Crear Clientes
//     for (let i = 0; i < 10; i++) {
//       await Cliente.create({
//         nombre: faker.person.firstName(),
//         email: faker.internet.email(),
//       }, { transaction });
//     }

//     // Commit the transaction
//     await transaction.commit();

//   } catch (error) {
//     console.error('Error during seeding: ', error);
//     throw error;
//   }
// }


// import { Sequelize } from 'sequelize-typescript';
// import { Fruta } from '../../../../apps/user-service/src/modules/frutas/entities/fruta.entity';
// import { Variedad } from '../../../../apps/user-service/src/modules/variedades/entities/variedade.entity';
// import { Agricultor } from '../../../../apps/user-service/src/modules/agricultores/entities/agricultore.entity';
// import { Campo } from '../../../../apps/user-service/src/modules/campos/entities/campo.entity';
// import { Cliente } from '../../../../apps/user-service/src/modules/clientes/entities/cliente.entity';
// import { Cosecha } from '../../../../apps/user-service/src/modules/cosechas/entities/cosecha.entity';
// import { faker } from '@faker-js/faker';

// export async function seedDatabase(sequelize: Sequelize) {
//   await sequelize.sync({ force: true });

//   // Crear Frutas y Variedades
//   for (let i = 0; i < 10; i++) {
//     let fruta = await Fruta.create({
//       nombre: faker.word.noun(),
//     });

//     for (let j = 0; j < 3; j++) {
//       await Variedad.create({
//         nombre: faker.word.noun(),
//         frutaId: fruta.id,
//       });
//     }
//   }

//   // Crear Agricultores y Campos
//   for (let i = 0; i < 5; i++) {
//     const agricultor = await Agricultor.create({
//       nombre: faker.person.firstName(),
//       email: faker.internet.email(),
//     });

//     for (let j = 0; j < 2; j++) {
//       await Campo.create({
//         nombre: faker.location.street(),
//         ubicacion: faker.location.city(),
//         agricultorId: agricultor.id,
//       });
//     }
//   }

//   // Crear Clientes
//   for (let i = 0; i < 10; i++) {
//     await Cliente.create({
//       nombre: faker.person.firstName(),
//       email: faker.internet.email(),
//     });
//   }

//   // Crear Cosechas
//   // for (let i = 0; i < 20; i++) {
//   //   await Cosecha.create({
//   //     fecha: faker.date.past(),
//   //     frutaId: faker.number.int({ min: 1, max: 10 }),
//   //     campoId: faker.number.int({ min: 1, max: 10 }),
//   //   });
//   // }
// }


