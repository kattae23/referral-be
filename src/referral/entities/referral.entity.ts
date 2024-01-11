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
  @ManyToOne(() => User, (user) => user.referredUsers)
  @JoinColumn({ name: 'referred_user_id' })
  referredUser: User;

  // User referred
  @ManyToOne(() => User, (user) => user.referringUsers)
  @JoinColumn({ name: 'referring_user_id' })
  referringUser: User;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;
}
