import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  return {
    mysql: {
      database: process.env.DB_NAME,
      host: process.env.DB_HOST,
      password: process.env.DB_PASSWORD,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
    },
  };
});
