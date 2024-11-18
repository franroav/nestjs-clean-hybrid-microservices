import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import * as fs from 'fs';
import { createReadStream } from 'fs';
import { CsvParser } from 'nest-csv-parser';
import { Readable } from 'stream';
import { UserService, SuccessResponseTemplate, RejectResponseTemplate } from './user-service.service'; // Import necessary types
import { ApiOperation, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { TokenGuard } from '../../../libs/shared/src/guards/token.guard';

// Define a response type to ensure consistency in return type
interface CsvImportResponse {
  count?: number;
  data?: SuccessResponseTemplate[];
  exitosas?: RejectResponseTemplate[];
  rechazadas?: RejectResponseTemplate[];
  message?: string;
  error?: string;
}

export class AppController {
  constructor(private readonly appService: UserService) {}

  @Post()//
  newUser(@Body() body:any): string {
    return this.appService.newUser(body)
  }
}

@Controller('carga')
export class UploadController {
  constructor(
    private readonly appService: UserService,
    private readonly csvParser: CsvParser
  ) {}

  @ApiBearerAuth()
  @UseGuards(TokenGuard)
  @Get('import')
  @ApiOperation({ summary: 'Ingresar ruta de documento csv' })
  @ApiQuery({
    name: 'csvPath',
    type: String,
    required: true,
    example: './uploads/csv/cosechas.csv',
  })
  async import(@Query('csvPath') csvPath: string): Promise<CsvImportResponse> {
    console.log('CSV Path => ', csvPath);

    // Validate if the CSV path is provided
    if (!csvPath) {
      return { message: 'CSV file path is required' };
    }

    // Validate if the CSV file exists
    if (!fs.existsSync(csvPath)) {
      console.error('CSV file not found:', csvPath);
      return { message: 'CSV file not found' };
    }

    const stream = createReadStream(csvPath);

    try {
      const headers = await this.getCsvHeaders(stream);
      const GenericDto = this.generateDto(headers);

      // Reset the stream to start from the beginning
      stream.close();
      const resetStream = createReadStream(csvPath);

      const entities = await this.csvParser.parse(resetStream, GenericDto);
      return this.appService.updateFileIntoDb(entities.list); // Modify this method's return type to match CsvImportResponse
    } catch (error: any) {
      console.error('Error parsing CSV file:', error);
      return { message: 'Error parsing CSV file', error: error.message };
    }
  }

  private async getCsvHeaders(stream: Readable): Promise<string[]> {
    return new Promise((resolve, reject) => {
      let headers: string[] = [];
      stream
        .on('data', (chunk) => {
          const lines = chunk.toString().split('\n');
          if (lines.length > 0) {
            headers = lines[0].split(',').map((header) => header.trim());
            stream.destroy();
            resolve(headers);
          }
        })
        .on('error', (err) => {
          reject(err);
        });
    });
  }

  private generateDto(headers: string[]) {
    class GenericDto {}
    headers.forEach((header) => {
      GenericDto.prototype[header] = undefined;
    });
    return GenericDto;
  }
}





// @Controller()
// export class UserServiceController {
//   constructor(private readonly UserService: UserService) {}
// }

// @Controller('carga')
// export class UploadController {
//   constructor(
//     private readonly appService: UserService,
//     private readonly csvParser: CsvParser
//   ) {}

//   @ApiBearerAuth()
//   @UseGuards(TokenGuard)
//   @Get('import')
//   @ApiOperation({ summary: 'Ingresar ruta de documento csv' })
//   @ApiQuery({ name: 'csvPath', type: String, required: true, example: "./uploads/csv/cosechas.csv" })
//   async import(@Query('csvPath') csvPath: string) {
    
//     console.log("CSV Path => ", csvPath);

//     if (!csvPath) {
//       return { message: 'CSV file path is required' };
//     }

//     if (!fs.existsSync(csvPath)) {
//       console.error("CSV file not found:", csvPath);
//       return { message: 'CSV file not found' };
//     }

//     const stream = createReadStream(csvPath);

//     try {
//       const headers = await this.getCsvHeaders(stream);
//       const GenericDto = this.generateDto(headers);

//       // Reset the stream to start from the beginning
//       stream.close();
//       const resetStream = createReadStream(csvPath);
//       // console.log("resetStream ", resetStream);
//       const entities = await this.csvParser.parse(resetStream, GenericDto);
//       // console.log("Parsed Entities =>", entities.list);
//       return this.appService.updateFileIntoDb(entities.list);
//     } catch (error) {
//       console.error("Error parsing CSV file:", error);
//       return { message: 'Error parsing CSV file', error };
//     }
//   }

//   private async getCsvHeaders(stream: Readable): Promise<string[]> {
//     return new Promise((resolve, reject) => {
//       let headers: string[] = [];
//       stream
//         .on('data', (chunk) => {
//           const lines = chunk.toString().split('\n');
//           if (lines.length > 0) {
//             headers = lines[0].split(',').map(header => header.trim());
//             stream.destroy();
//             resolve(headers);
//           }
//         })
//         .on('error', (err) => {
//           reject(err);
//         });
//     });
//   }

//   private generateDto(headers: string[]) {
//     class GenericDto {}
//     headers.forEach((header) => {
//       GenericDto.prototype[header] = undefined;
//     });
//     return GenericDto;
//   }
// }


