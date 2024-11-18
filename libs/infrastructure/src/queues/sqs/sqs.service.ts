import AWS from 'aws-sdk';
import { ENV } from '../config/config';
import logger from '../lib/log';

interface Event {
  local: string;
}

interface Config {
  queueUrl: string;
  sendSqs: boolean;
}

class SQSService {
  async sendQueue(event: Event, messageBody: any, traceIdMessage: string): Promise<{ status: boolean; message: string }> {
    return new Promise((resolve) => {
      try {
        const STAGE = process.env.NODE_ENV as keyof typeof ENV;
        const config = ENV[STAGE] as Config;

        const { queueUrl, sendSqs } = config;

        if (sendSqs === true) {
          const sqs = new AWS.SQS({ region: 'us-east-1' });

          logger.info('', {
            timestamp: new Date(),
            service: 'SGVLOADER',
            action: 'SQS_REQ',
            message: 'enviando nc por sqs',
            idTrace: traceIdMessage,
            log: messageBody,
            mainIdentifier: event.local,
            object: 'local',
            params: { local: event.local, queueUrl },
            level: 'info',
          });

          sqs.sendMessage(
            {
              MessageBody: JSON.stringify(messageBody),
              QueueUrl: queueUrl,
              DelaySeconds: 180,
            },
            (err, data) => {
              if (err) {
                logger.info('', {
                  timestamp: new Date(),
                  service: 'SGVLOADER',
                  action: 'SQS_RES',
                  message: 'error con sqs',
                  idTrace: traceIdMessage,
                  log: err.stack,
                  mainIdentifier: event.local,
                  object: 'local',
                  params: { local: event.local, queueUrl },
                  level: 'error',
                });
                resolve({ status: false, message: err.stack ?? 'Unknown error' });
                return;
              }

              logger.info('', {
                timestamp: new Date(),
                service: 'SGVLOADER',
                action: 'SQS_RES',
                message: 'mensaje enviado',
                idTrace: traceIdMessage,
                log: data,
                mainIdentifier: event.local,
                object: 'local',
                params: { local: event.local, queueUrl },
                level: 'info',
              });
              resolve({ status: true, message: 'OK' });
            }
          );
        } else {
          logger.info('', {
            timestamp: new Date(),
            service: 'SGVLOADER',
            action: 'SQS_REQ',
            message: 'Desactivado SQS',
            idTrace: traceIdMessage,
            log: 'está desactivada la opción de envío SQS',
            mainIdentifier: event.local,
            object: 'local',
            params: { local: event.local, queueUrl },
            level: 'info',
          });
          resolve({ status: false, message: 'está desactivada la opción de envío SQS' });
        }
      } catch (error) {
        logger.info('', {
          timestamp: new Date(),
          service: 'SGVLOADER',
          action: 'SQS_REQ',
          message: 'error [ sendQueue - service ]',
          idTrace: traceIdMessage,
          log: error.stack ?? 'Unknown error',
          mainIdentifier: event.local,
          object: 'local',
          params: { local: event.local },
          level: 'error',
        });
        resolve({ status: false, message: error.message || 'Unknown error' });
      }
    });
  }
}

export default new SQSService();



