import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from "../roles.decorator";

function matchRoles(roles: string[], userRoles: string[]): boolean {
    if (!userRoles || userRoles.length === 0) {
        return false; // Якщо у користувача немає ролей, доступ заборонено
    }
    return roles.some(roles => userRoles.includes(roles)); // Перевіряємо, чи хоча б одна роль користувача відповідає потрібній
}

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector:Reflector){}
  canActivate(
    context: ExecutionContext,
  ): boolean {
    const roles = this.reflector.get(Roles, context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    // Перевірка наявності користувача
    if (!user || !user.roles) {
        return false; // Якщо користувача немає або у нього немає ролей, доступ заборонено
    }
    return matchRoles(roles, user.roles);
  }
  }
