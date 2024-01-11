import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { passwordHash } from '../utils/password-hash';
import { ReferralService } from '../referral/referral.service';
import { WhoRefferEnum } from '../utils/enum';

@Injectable()
export class UserService {
  private readonly logger = new Logger('UserService');
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly referralService: ReferralService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const {
        password,
        date_of_birth,
        how_did_you_hear,
        referrer_username,
        ...userData
      } = createUserDto;

      const user = await this.userRepo.findOne({
        where: { email: userData.email },
      });
      if (user) return new NotFoundException('Email already exists');

      const birth = new Date(date_of_birth);

      const newUser = this.userRepo.create({
        ...userData,
        dateOfBirth: birth,
        whoRefferEnum: how_did_you_hear,
        password: passwordHash(password),
      });

      const savedUser = await this.userRepo.save(newUser);

      delete newUser.password;

      if (how_did_you_hear === WhoRefferEnum.USER)
        await this.referralService.create(
          {
            how_did_you_hear,
            referrer_username,
          },
          savedUser,
        );

      return {
        ...newUser,
      };
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findOne(term: string) {
    const queryBuilder = this.userRepo.createQueryBuilder();
    const user = await queryBuilder
      .where('username LIKE :username OR email LIKE :email OR id = :id', {
        username: `%${term}%`,
        email: `%${term}%`,
        id: term,
      })
      .getOne();
    if (!user) {
      return new NotFoundException(`user with "${term}" not found`);
    }

    return user;
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
