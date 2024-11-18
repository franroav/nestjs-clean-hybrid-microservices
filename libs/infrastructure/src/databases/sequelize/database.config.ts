import { SequelizeModuleOptions } from '@nestjs/sequelize';

export const dataBaseConfig: SequelizeModuleOptions = {
  dialect: 'sqlite',
  storage: 'libs/infrastructure/src/databases/sequelize/.db/data.sqlite3',
  autoLoadModels: true,
  synchronize: false, // Cambiado a true para forzar la sincronización
};

// nest g res frutas

// Construir una pequeña API en TypeScript, usando SQLite que permita agregar:

//     Frutas y sus distintos tipos de Variedades.
//     Cosechas.
//     Agricultores y sus distintos Campos.
//     Clientes.

// También debe incluir una ruta que al enviarle un CSV lo lea y cargue su data dentro de la DDBB.

//     El mail debe ser único dentro de los agricultores.
//     El mail debe ser único dentro de los clientes.
//     La combinación Nombre Ubicación de los campos debe ser única.
//     El nombre de la fruta debe ser única.
//     La combinación fruta variedad debe ser única.

// Se valorara:

//     Orden de código.
//     Orden de commits.
//     Validaciones de schema.
//     Separación de concerns.
//     Manejo de errores.

// Nice to Do:

//     Usar una arquitectura de DDD.
