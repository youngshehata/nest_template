import {
  CallHandler,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { Observable, map } from 'rxjs';
import { BlacklistService } from 'src/features/blacklist/blacklist.service';

@Injectable()
export class BlacklistInterceptor implements NestInterceptor {
  constructor(private readonly blacklistService: BlacklistService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const res = context.switchToHttp().getResponse<FastifyReply>();
    const req = res.request as any;

    const isBlocked = await this.blacklistService.isIpBlocked(req.ip);

    if (isBlocked) {
      throw new ForbiddenException('IP is blocked');
    }

    // not blocked, proceed
    return next.handle();
  }
}
