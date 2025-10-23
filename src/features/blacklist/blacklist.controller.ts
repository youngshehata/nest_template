import { Controller, Delete, Post } from '@nestjs/common';
import { BlacklistService } from './blacklist.service';
import { BlacklistDto } from './dtos/Blacklist.dto';

@Controller('blacklist')
export class BlacklistController {
  constructor(private readonly blacklistService: BlacklistService) {}

  //----------------------------------------------------
  @Post()
  addToBlacklist(data: BlacklistDto) {
    return this.blacklistService.addToBlacklist(data);
  }

  //----------------------------------------------------
  @Delete()
  removeFromBlacklist(ip: string) {
    return this.blacklistService.removeFromBlacklist(ip);
  }
}
