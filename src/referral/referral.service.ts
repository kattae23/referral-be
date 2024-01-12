import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Referral } from './entities/referral.entity';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class ReferralService {
  private readonly logger = new Logger('ReferralService');
  constructor(
    @InjectRepository(Referral)
    private readonly referralRepo: Repository<Referral>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  async create(referredUser: User, refereeUsers: User) {
    try {
      const referral = this.referralRepo.create({
        referredUser,
        refereeUsers,
      });

      return await this.referralRepo.save(referral);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  private handleDBExceptions(error: any): never {
    if (error.code === '23505' || error.code === 'SQLITE_CONSTRAINT')
      throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
