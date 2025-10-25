import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesService } from 'src/features/roles/roles.service';
import { UsersService } from 'src/features/users/users.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private usersService: UsersService,
    private rolesService: RolesService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles) {
      return true;
    }
    // if no roles required, then return true
    // else get the user roles from database (secure)
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) {
      return false;
    }

    const userInDB = await this.usersService.findUnique(user.email);
    if (!userInDB) {
      return false;
    }

    const rolesInDB = await this.rolesService.getRolesForUser(userInDB.id);

    const mappedRoles = rolesInDB.map((role) => role.toLowerCase());

    const hasRole = roles.some((role) =>
      mappedRoles.includes(role.toLowerCase()),
    );
    if (!hasRole) {
      return false;
    }

    return true;
  }
}
