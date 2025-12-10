import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";

@Injectable()
export class JwtAuthGuard implements CanActivate {

    constructor (private jwtService: JwtService) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest();
        try {
            const authHeaders = req.headers.authorization;
            const bearer = authHeaders.split(' ')[0];
            const token = authHeaders.split(' ')[1];
            if (bearer != 'Bearer' || !token) {
                throw new UnauthorizedException('Пользователь не авторизован: нет токена');
            }

            const user = this.jwtService.verify(token);
            req.user = user;
            return true;
        } catch (e) {
            console.log(e);
            throw new UnauthorizedException(`Пользователь не авторизован`);
        }
    }

}