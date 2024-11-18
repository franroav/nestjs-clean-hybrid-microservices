import { soap } from 'strong-soap';
import { ENV } from '../config/config';
import { validateEvent } from '../utils/validate';
import logger from '../lib/log';

interface ClientResponse {
  result: boolean;
  client: any;
}

interface CreditNoteResponse {
  result: boolean;
  data: any;
}

class Soap {
  async getClient(event: any, traceIdMessage: string): Promise<ClientResponse> {
    return new Promise((resolve) => {
      try {
        const STAGE = process.env.NODE_ENV || 'development';
        const config = ENV[STAGE];
        const { endpointWSDL } = config;
        const options = {};

        soap.createClient(endpointWSDL, options, (err: any, client: any) => {
          if (err) {
            logger.info('', {
              timestamp: new Date(),
              service: 'SGVLOADER',
              action: 'CLIENT_SGVAPI_RES',
              message: 'error [ createClient ]',
              idTrace: traceIdMessage,
              log: err.stack,
              mainIdentifier: event.local,
              object: 'local',
              params: { local: event.local, url: endpointWSDL },
              level: 'error',
            });
            resolve({ result: false, client: err });
          } else {
            logger.info('', {
              timestamp: new Date(),
              service: 'SGVLOADER',
              action: 'CLIENT_SGVAPI_RES',
              message: 'respuesta cliente wsdl',
              idTrace: traceIdMessage,
              mainIdentifier: event.local,
              object: 'local',
              params: { local: event.local, url: endpointWSDL },
              level: 'info',
            });
            resolve({ result: true, client });
          }
        });
      } catch (error: any) {
        logger.info('', {
          timestamp: new Date(),
          service: 'SGVLOADER',
          action: 'CLIENT_SGVAPI_REQ',
          message: 'error [ getClient ]',
          idTrace: traceIdMessage,
          log: error.stack,
          mainIdentifier: event.local,
          object: 'local',
          params: { local: event.local },
          level: 'error',
        });
        resolve({ result: false, client: error });
      }
    });
  }

  async getCreditNoteWsdl(client: any, event: any, traceIdMessage: string): Promise<CreditNoteResponse> {
    return new Promise((resolve) => {
      try {
        validateEvent(event).then(async (args: any) => {
          logger.info('', {
            timestamp: new Date(),
            service: 'SGVLOADER',
            action: 'SGVAPI_REQ',
            message: 'body de envío wsdl',
            idTrace: traceIdMessage,
            log: args,
            mainIdentifier: event.local,
            object: 'local',
            params: { local: event.local },
            level: 'info',
          });

          // consulta las notas de crédito al wsdl
          const nc = await client.notaCredito(args);
          logger.info('', {
            timestamp: new Date(),
            service: 'SGVLOADER',
            action: 'SGVAPI_RES',
            message: 'obtención de notas de crédito',
            idTrace: traceIdMessage,
            log: nc,
            mainIdentifier: event.local,
            object: 'local',
            params: { local: event.local },
            level: 'info',
          });

          resolve({ result: true, data: nc });
        });
      } catch (error: any) {
        logger.info('', {
          timestamp: new Date(),
          service: 'SGVLOADER',
          action: 'SGVAPI_RES',
          message: 'error [ getCreditNoteWsdl ]',
          idTrace: traceIdMessage,
          log: error.stack,
          mainIdentifier: event.local,
          object: 'local',
          params: { local: event.local },
          level: 'error',
        });
        resolve({ result: false, data: error.stack });
      }
    });
  }
}

export default Soap;