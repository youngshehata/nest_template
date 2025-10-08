export class TResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: unknown | null;
  error: string | null;
  timestamp: Date;
  path: string;
  constructor() {
    this.timestamp = new Date();
  }
}
