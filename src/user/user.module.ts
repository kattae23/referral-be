import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Referral } from '../referral/entities/referral.entity';
import { ReferralModule } from '../referral/referral.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
  imports: [
    TypeOrmModule.forFeature([User, Referral]),
    forwardRef(() => ReferralModule),
  ],
})
export class UserModule {}
