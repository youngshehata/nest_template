export type TError = {
  uuid: string;
  message: string;
  ip: string;
  time: Date;
  path: string;
  method: string;
  stack: string;
  isHttp: boolean;
  user?: any;
};
