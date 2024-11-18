import AWS from 'aws-sdk';

const secretsmanager = new AWS.SecretsManager({ region: 'us-east-1' });
const config = ENV[node_env];

export const getSecret = async (): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        const params = {
            SecretId: config.secret
        };

        secretsmanager.getSecretValue(params, (err, data) => {
            if (err) {
                console.error(err); // an error occurred
                reject(err); // ensure promise rejects on error
            } else if (data?.SecretString) {
                process.env.secret = data.SecretString;
                resolve(true);
            } else {
                reject(new Error('No secret value found'));
            }
        });
    });
};

export const getJsonSecret = (): Record<string, any> => {
    if (!process.env.secret) {
        throw new Error('Secret not available in environment variables');
    }
    return JSON.parse(process.env.secret);
};

// const AWS = require("aws-sdk");
// let secretsmanager = new AWS.SecretsManager({ region: "us-east-1" });
// const config = global.ENV[global.node_env];

// const getSecret = async () => {
//   return new Promise((resolve) => {
//     var params = {
//       SecretId: config.secret,
//     };

//     console.log(params);
//     secretsmanager.getSecretValue(params, function (err, data) {
//       if (err) {
//         console.log(err); // an error occurred
//       } else {
//         process.env.secret = data.SecretString;
//         resolve(true);
//       }
//     });
//   });
// };

// const getJsonSecret = () => {
//   return JSON.parse(process.env.secret);
// };

// module.exports = { getSecret, getJsonSecret };
