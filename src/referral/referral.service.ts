import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
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

  async create(referredUser: User, referringUser: User) {
    // const referringUser = await this.userService.findOne(refereeUsername);

    // if (!referredUser)
    //   return new NotFoundException(`user "${refereeUsername}" not found`);

    const referral = this.referralRepo.create({
      referredUser,
      referringUser,
    });

    console.log(referringUser);

    await this.referralRepo.save(referral);
  }
}
