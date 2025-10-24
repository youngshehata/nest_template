import { Injectable } from '@nestjs/common';

@Injectable()
export class RolesService {
  constructor() {}

  async getRolesForUser(userId: string) {
    // TODO: get roles for user from database table (Users_Roles)
    return ['admin'];
  }
}
