import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateReferralDto } from './dto/create-referral.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Referral } from './entities/referral.entity';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class ReferralService {
  constructor(
    @InjectRepository(Referral)
    private readonly referralRepo: Repository<Referral>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  async create(createReferralDto: CreateReferralDto, referee: User) {
    const { how_did_you_hear, referrer_username } = createReferralDto;
  }
}
