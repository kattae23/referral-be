import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity({ name: 'referral' })
export class Referral {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // User who reffer
  @ManyToOne(() => User, (user) => user.referredUser)
  @JoinColumn({ name: 'referred_user_id' })
  referredUser: User;

  // User referred
  @ManyToOne(() => User, (user) => user.refereeUsers)
  @JoinColumn({ name: 'referee_users_id' })
  refereeUsers: User;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;
}
