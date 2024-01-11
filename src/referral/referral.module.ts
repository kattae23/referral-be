import { Module, forwardRef } from '@nestjs/common';
import { ReferralService } from './referral.service';
import { ReferralController } from './referral.controller';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Referral } from './entities/referral.entity';

@Module({
  controllers: [ReferralController],
  providers: [ReferralService],
  exports: [ReferralService],
  imports: [TypeOrmModule.forFeature([Referral]), forwardRef(() => UserModule)],
})
export class ReferralModule {}
