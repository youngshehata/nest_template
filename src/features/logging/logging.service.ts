import fireAndForget from '@app/common/helpers/fireAndForget';
import { TLog } from '@app/common/types/TLog';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs/promises';

@Injectable()
export class LoggingService implements OnModuleInit {
  private readonly logger = new Logger('LoggingService');
  async onModuleInit() {
    await fs.mkdir('logs', { recursive: true });
  }

  private async log(data: TLog) {
    try {
      const date = new Date().toISOString().split('T')[0]; // gives date without time, e.g. 2025-10-08
      await fs.appendFile(`logs/${date}.json`, `${JSON.stringify(data)}\n`);
    } catch (error) {
      this.logger.error(error);
    }
  }

  logToFile(log: TLog) {
    fireAndForget(async () =>
      this.log({ ...log, timestamp: log.timestamp ?? new Date() }),
    );
  }
}
