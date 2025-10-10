import { Controller } from '@nestjs/common';
import { ErrorsService } from './errors.service';

@Controller('errors')
export class ErrorsController {
  constructor(private readonly errorsService: ErrorsService) {}
  // Error controller exists just incase you need to create endpoints for errors later
}
