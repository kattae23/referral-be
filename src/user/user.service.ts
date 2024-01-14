import {
  BadRequestException,
  Injectable,
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
        how_did_you_hear: whoRefferEnum,
        referrer_username,
        ...userData
      } = createUserDto;

      const user = await this.findOneBy(
        'username = :username AND email = :email OR email = :email OR username = :username',
        {
          email: userData.email,
          username: userData.username,
        },
      );
      if (user) throw new NotFoundException('Email or username already exists');

      const birth = new Date(date_of_birth);

      const newUser = this.userRepo.create({
        ...userData,
        dateOfBirth: birth,
        whoRefferEnum,
        password: passwordHash(password),
      });

      let savedUser: User;

      if (whoRefferEnum === WhoRefferEnum.USER) {
        const referredUser = await this.findOneBy(
          'username = :referrer_username',
          { referrer_username },
        );

        if (!referredUser)
          throw new NotFoundException(
            `Referred "${referrer_username}" not found`,
          );

        savedUser = await this.userRepo.save(newUser);
        delete savedUser.password;

        const referral = await this.referralService.create(
          referredUser,
          savedUser,
        );

        if (referral) {
          await this.userRepo.update(referredUser.id, {
            points: (referredUser.points += 1),
          });
        }
      } else {
        savedUser = await this.userRepo.save(newUser);
        delete savedUser.password;
      }

      return {
        ...savedUser,
      };
    } catch (error) {
      throw this.handleDBExceptions(error);
    }
  }

  async getUsers() {
    try {
      const queryBuilder = this.userRepo
        .createQueryBuilder('users')
        .leftJoinAndSelect('users.referredUser', 'referredUsers')
        .leftJoinAndSelect(
          'referredUsers.refereeUsers',
          'referredUsersRefereeUsers',
        );

      const users = await queryBuilder.getMany();

      return users;
    } catch (error) {
      throw this.handleDBExceptions(error);
    }
  }

  async getUserDetails(userId: string) {
    try {
      const queryBuilder = this.userRepo
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.referredUser', 'referredUsers')
        .leftJoinAndSelect(
          'referredUsers.refereeUsers',
          'referredUsersRefereeUsers',
        );
      const user = await queryBuilder
        .where('user.id = :userId', {
          userId,
        })
        .getOne();

      if (!user)
        throw new NotFoundException(`Theres no user with that id "${userId}"`);

      return user;
    } catch (error) {
      throw this.handleDBExceptions(error);
    }
  }

  async getUserReferees(userId: string) {
    try {
      const queryBuilder = this.userRepo.createQueryBuilder('user');
      const user = await queryBuilder
        .leftJoinAndSelect('user.referredUser', 'referredUsers')
        .leftJoinAndSelect(
          'referredUsers.refereeUsers',
          'referredUsersRefereeUsers',
        )
        .leftJoinAndSelect('user.refereeUsers', 'refereeUsers')
        .leftJoinAndSelect(
          'refereeUsers.referredUser',
          'referredUsersWhoReffer',
        )
        .where('user.id = :userId', {
          userId,
        })
        .orderBy('referredUsers.created_at', 'ASC')
        .orderBy('referredUsersRefereeUsers.created_at', 'ASC')
        .getOne();

      if (!user)
        throw new NotFoundException(`Theres no user with that id "${userId}"`);

      const referees = user.referredUser.map(
        (referred) => referred.refereeUsers,
      );

      return {
        user,
        referees,
        total: referees.length,
      };
    } catch (error) {
      throw this.handleDBExceptions(error);
    }
  }

  async getUserPoints(userId: string) {
    const queryBuilder = this.userRepo.createQueryBuilder();
    const user = await queryBuilder.where('id = :userId', { userId }).getOne();

    return user.points;
  }

  async findOneBy(condition: string, search: any) {
    const queryBuilder = this.userRepo.createQueryBuilder();
    const user = await queryBuilder.where(condition, search).getOne();

    return user;
  }

  private handleDBExceptions(error: any): never {
    if (error.code === '23505' || error.code === 'SQLITE_CONSTRAINT')
      throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new BadRequestException(error);
  }
}
