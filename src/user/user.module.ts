import { forwardRef, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user.model';
import { AuthModule } from 'src/auth/auth.module';
import { AchievementsModule } from 'src/achievements/achievements.module';
import { Achievements } from 'src/achievements/achievements.model';


@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [
    SequelizeModule.forFeature([User, Achievements]),
    forwardRef(() => AuthModule),
    AchievementsModule
  ],
  exports: [
    UserService,
  ]
})
export class UserModule {}
