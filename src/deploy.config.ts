import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  STAGE: process.env.STAGE,
}));
