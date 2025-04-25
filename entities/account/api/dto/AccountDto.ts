import { ClientDto } from '@/entities/user/api/dto/ClientDto';
import { UserRole } from '@/entities/user/api/dto/UserRole';

export type AccountDto = {
  registration: ClientDto;
  login: {
    email: string;
    password: string;
    role: UserRole;
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
