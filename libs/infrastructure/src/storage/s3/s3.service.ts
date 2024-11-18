import { Provider } from '@nestjs/common';
import { S3 } from 'aws-sdk';

export const AWS_S3_PROVIDER: Provider = {
  provide: 'AWS_S3',
  useFactory: () => {
    return new S3({
      region: process.env.AWS_REGION,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
  },
};

// const AWS = require('aws-sdk')
// const config = global.ENV[global.node_env]

// class S3 {
//   constructor () {
//     // Configuracion de las variables para poder acceder a AWS
//     AWS.config.update({
//       region: config.aws.region
//     })
//   }

//   getFileParams (bucket) {
//     const s3 = new AWS.S3()
//     return new Promise(async (resolve) => {
//       const options = {
//         Bucket: bucket.Bucket,
//         Key: bucket.Key
//       }
//       s3.getObject(options, function (err, data) {
//         if (err) {
//           console.log('El archivo no existe, lo creamos')
//           resolve({ isResult: false })
//         }
//         if (data) {
//           const file = data.Body.toString()
//           resolve({ isResult: true, data: JSON.parse(file) })
//         }
//       })
//     })
//   }

//   uploadFile (bucket, file) {
//     const s3 = new AWS.S3()
//     return new Promise(async (resolve) => {
//       const params = {
//         Bucket: bucket.Bucket,
//         Key: bucket.Key,
//         Body: file,
//         ACL: 'public-read'
//       }
//       s3.upload(params, function (err, data) {
//         if (err) {
//           console.log(err)
//           resolve({ isResult: false })
//         }
//         if (data) {
//           resolve({ isResult: true })
//         }
//       })
//     })
//   }
// }

// module.exports = S3



// const config = global.ENV[global.node_env]
// const S3 = require('../lib/s3')
// // LOGS
// const logger = require('./log')

// const createFile = async (data, name) => {
//   return new Promise(async (resolve) => {
//     const s3 = new S3()
//     const options = {
//       Bucket: config.bucket,
//       Key: name
//     }

//     await s3.uploadFile(options, data)

//     logger.info('', {
//       timestamp: new Date(),
//       app: 'payment-ajustes',
//       service: 'CL-PAYMENT-AJUSTES',
//       type: 'LOG',
//       object: 'TRANSACTIONS',
//       action: 'CREATE_FILE_FINISH',
//       message: `Se crea el archivo ${options.Key}`,
//       log: null
//     })
//     resolve(true)
//   })
// }

// module.exports = {
//   createFile
// }
