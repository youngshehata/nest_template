export type TError = {
  message: string;
  ip: string;
  path: string;
  method: string;
  stack: string;
  time: Date;
  isHttp: boolean;
  user?: any;
};
