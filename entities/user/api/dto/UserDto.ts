import { UserRole } from '@/entities/user/api/dto/UserRole';

export type UserDto = {
  id?: string;
  fullName: string;
  email: string;
  phone: string;
  password?: string;
  active?: boolean;
  verificationToken?: string;
  role: UserRole;
};
