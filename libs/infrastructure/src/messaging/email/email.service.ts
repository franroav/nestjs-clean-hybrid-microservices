import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';

@Injectable()
export class EmailService {
  private ses: AWS.SES;

  constructor() {
    AWS.config.update({ region: process.env.AWS_REGION });
    this.ses = new AWS.SES();
  }

  async sendEmail(toAddress: string, subject: string, body: string): Promise<AWS.SES.SendEmailResponse> {
    const params: AWS.SES.SendEmailRequest = {
      Source: process.env.SES_SOURCE_EMAIL,
      Destination: {
        ToAddresses: [toAddress],
      },
      Message: {
        Subject: {
          Data: subject,
        },
        Body: {
          Text: {
            Data: body,
          },
        },
      },
    };

    return this.ses.sendEmail(params).promise();
  }
}