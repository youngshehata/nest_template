import { Injectable } from '@nestjs/common';
import { BlacklistDto } from './dtos/Blacklist.dto';

@Injectable()
export class BlacklistService {
  constructor(/* Inject Repo */) {}

  //----------------------------------------------------
  async addToBlacklist(data: BlacklistDto) {
    return 'Added';
  }

  //----------------------------------------------------
  async removeFromBlacklist(ip: string) {
    return 'Removed';
  }

  //----------------------------------------------------
  async isIpBlocked(ip: string): Promise<boolean> {
    // TODO: Logic where you query ip from database table, return true if exists and false if not
    return false;
  }
}
