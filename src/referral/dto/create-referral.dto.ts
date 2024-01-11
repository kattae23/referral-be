import { IsEnum, IsString, MinLength } from 'class-validator';
import { WhoRefferEnum } from '../../utils/enum';

export class CreateReferralDto {
  @IsString()
  @IsEnum(WhoRefferEnum)
  how_did_you_hear: WhoRefferEnum;

  @IsString()
  @MinLength(3)
  referrer_username: string;
}
