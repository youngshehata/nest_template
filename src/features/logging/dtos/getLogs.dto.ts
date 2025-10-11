import {
  CONST_DEFAULT_PAGE,
  CONST_DEFAULT_PAGE_SIZE,
} from '@app/common/constraints/pagination/pagination.constraints';
import { TLog } from '@app/common/types/TLog';
import { Transform } from 'class-transformer';
import { IsDate, IsNotEmpty, IsOptional, IsPositive } from 'class-validator';

export class GetLogsDto {
  @IsDate()
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  startDate: Date;

  @IsDate()
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  endDate: Date;

  @IsOptional()
  @IsPositive()
  page?: number = CONST_DEFAULT_PAGE;

  @IsOptional()
  @IsPositive()
  pageSize?: number = CONST_DEFAULT_PAGE_SIZE;
}

export class GetLogsResponseDto {
  data: TLog[];
  total: number;
}
