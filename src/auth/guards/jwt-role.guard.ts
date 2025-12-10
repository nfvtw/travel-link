import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";
import { RolesKey } from "./role-auth.decorator";

@Injectable()
export class RoleGuard implements CanActivate {

    constructor (private jwtService: JwtService, private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        try {
            const requiredRoles = this.reflector.getAllAndOverride<string[]>(RolesKey, [
                context.getHandler(),
                context.getClass(),
            ])
            console.log(requiredRoles);
            if (requiredRoles.length === 0) {
                return true; // Если роли не указаны - доступ разрешен всем пользователям
            }
            const req = context.switchToHttp().getRequest();
            const authHeaders = req.headers.authorization;
            const bearer = authHeaders.split(' ')[0];
            const token = authHeaders.split(' ')[1];
            if (bearer != 'Bearer' || !token) {
                throw new UnauthorizedException('Пользователь не авторизован: нет токена');
            }
            const user = this.jwtService.verify(token);
            console.log(user.role)
            req.user = user;
            const trueRole = requiredRoles.includes(user.role);
            return (trueRole);
        } catch (e) {
            console.log(e);
            throw new HttpException({message: `Нет доступа`, error: e.message, status: e.status}, HttpStatus.FORBIDDEN);
        }
    }

}