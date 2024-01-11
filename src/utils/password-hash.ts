import * as bcrypt from 'bcrypt';

export function passwordHash(password: string): string {
  const saltRounds = 10;

  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
}
