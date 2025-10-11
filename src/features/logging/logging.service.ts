import fireAndForget from '@app/common/helpers/fireAndForget';
import { TLog } from '@app/common/types/TLog';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs/promises';
import { GetLogsDto, GetLogsResponseDto } from './dtos/getLogs.dto';
import {
  extractDaysAsArray,
  formatDateOnly,
} from '@app/common/helpers/datesHelper';
import {
  CONST_DEFAULT_PAGE,
  CONST_DEFAULT_PAGE_SIZE,
} from '@app/common/constraints/pagination/pagination.constraints';

@Injectable()
export class LoggingService implements OnModuleInit {
  private readonly logger = new Logger('LoggingService');
  async onModuleInit() {
    await fs.mkdir('logs', { recursive: true });
  }

  //! ################################# Private Log Record #################################
  private async log(data: TLog) {
    try {
      const date = formatDateOnly(new Date()); // gives date without time, e.g. 2025-10-08
      await fs.appendFile(`logs/${date}.json`, `${JSON.stringify(data)},\n`);
    } catch (error) {
      this.logger.error(error);
    }
  }

  //! ################################# Public Log To File #################################
  logToFile(log: TLog) {
    fireAndForget(async () =>
      this.log({ ...log, timestamp: log.timestamp ?? new Date() }),
    );
  }

  //! ################################# Private Get Logs By Day  ###############################
  private async getLogsByDay(day: Date): Promise<TLog[]> {
    const date = formatDateOnly(day);
    let data = await fs.readFile(`logs/${date}.json`, 'utf-8');
    // remove trailing comma if it exists
    data = data.trim().replace(/,+\s*$/, '');
    // parse as array
    return JSON.parse(`[${data}]`);
  }

  //! ################################# Public Get Logs #################################
  async getLogs(data: GetLogsDto): Promise<GetLogsResponseDto> {
    const { page = CONST_DEFAULT_PAGE, pageSize = CONST_DEFAULT_PAGE_SIZE } =
      data;
    const days = extractDaysAsArray(data.startDate, data.endDate);

    // read all days, flatten nested arrays
    const logsArrays = await Promise.all(
      days.map((day) => this.getLogsByDay(day)),
    );
    const allLogs: TLog[] = logsArrays.flat();

    // sort by timestamp asc
    allLogs.sort(
      (a, b) =>
        new Date(a.timestamp!).getTime() - new Date(b.timestamp!).getTime(),
    );

    const total = allLogs.length;
    const start = (page - 1) * pageSize;
    const paged = allLogs.slice(start, start + pageSize);

    return { data: paged, total };
  }
}
