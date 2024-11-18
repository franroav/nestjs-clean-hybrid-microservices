import { Injectable, Logger } from '@nestjs/common';
import { spawn } from 'child_process';

@Injectable()
export class ChildProcessesService {
  private readonly logger = new Logger(ChildProcessesService.name);

  executeCommand(command: string, args: string[] = []): Promise<string> {
    if (!command) {
      return Promise.reject(new Error('Command is required.'));
    }

    return new Promise((resolve, reject) => {
      const process = spawn(command, args);
      let output = '';

      process.stdout.on('data', (data) => {
        output += data.toString();
      });

      process.stderr.on('data', (data) => {
        this.logger.error(`Command error output: ${data}`);
      });

      process.on('close', (code) => {
        if (code === 0) {
          this.logger.log(`Process completed successfully with output: ${output}`);
          resolve(output);
        } else {
          reject(new Error(`Process exited with code ${code}`));
        }
      });
    });
  }
}
