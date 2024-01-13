import { UserDto } from '@/entities/user/api/dto/UserDto';

export type AccountDto = {
  registration: UserDto;
  login: {
    email: string;
    password: string;
  };
  verification: {
    userId?: string;
    verificationToken?: string;
  };
  recovery: {
    request: { email: string };
    confirmation: { token: string };
  };
};
