import { ClientDto } from '@/entities/user/api/dto/ClientDto';

export type AccountDto = {
  registration: ClientDto;
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
