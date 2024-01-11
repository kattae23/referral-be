import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { WhoRefferEnum } from 'src/utils/enum';

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  username: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsDateString()
  @IsOptional()
  date_of_birth?: string;

  @IsString()
  @IsEnum(WhoRefferEnum)
  how_did_you_hear: WhoRefferEnum;

  @IsString()
  @IsOptional()
  @MinLength(3)
  referrer_username?: string;

  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  password: string;
}
