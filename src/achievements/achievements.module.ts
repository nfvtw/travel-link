import { forwardRef, Module } from '@nestjs/common';
import { AchievementsController } from './achievements.controller';
import { AchievementsService } from './achievements.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Achievements } from './achievements.model';
import { User } from 'src/user/user.model';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';

@Module({
    controllers: [AchievementsController],
    providers: [AchievementsService],
    imports: [
        SequelizeModule.forFeature([Achievements, User]),
    ],
    exports: [
        AchievementsService
    ]
})
export class AchievementsModule {}
