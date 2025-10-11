export type TLog = {
  level: TLogLevel;
  message: string;
  timestamp?: Date;
  metaData?: TLogMetaData;
};

export type TLogLevel = 'info' | 'warn' | 'error';

export type TLogMetaData = {
  user?: any;
  ip?: string;
  requestId?: string;
  path?: string;
  method?: string;
  statusCode?: number;
  stack?: string;
};
