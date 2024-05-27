import { UserRole } from '@/entities/user/api/dto/UserRole';
import { AddressType } from './AddressType';

export interface UserDto {
  id?: string;
  email: string;
  fullName: string;
  phone: string;
  password?: string;
  active?: boolean;
  verificationToken?: string;
  role: UserRole;
  addresses?: {
    type?: AddressType;
    line1: string;
    line2?: string;
    country?: string;
    city: string;
    state: string;
    zip: string;
  };
}
