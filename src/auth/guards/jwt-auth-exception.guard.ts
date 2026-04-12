import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";

@Injectable()
export class JwtAuthExceptionGuard implements CanActivate {

    constructor (private jwtService: JwtService) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest();
        try {
            console.log(1)
            const authHeaders = req.headers.authorization;
            const bearer = authHeaders.split(' ')[0];
            const token = authHeaders.split(' ')[1];
            console.log(2)
            console.log(bearer, "TOKEN:", token);
            console.log(bearer, token)
            if (bearer != 'Bearer' || !token) {
                console.log(3)
                req.user = null;
                return true;
            }
            console.log(4)
            const user = this.jwtService.verify(token);
            console.log(5)
            req.user = user;
            return true;
        } catch (e) {
            console.log(e);
            throw new UnauthorizedException(`Пользователь не авторизован`);
        }
    }

}