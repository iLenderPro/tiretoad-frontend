import { UserRole } from '@/entities/user/api/dto/UserRole';

export interface UserDto {
  id?: string;
  email: string;
  fullName: string;
  phone: string;
  password?: string;
  active?: boolean;
  verificationToken?: string;
  role: UserRole;
  addresses?: Address[];
}

export type Address = {
  type?: AddressType;
  line1: string;
  line2?: string;
  country?: string;
  city: string;
  state: string;
  zip: string;
};

export enum AddressType {
  BILLING = 'BILLING',
  SHIPPING = 'SHIPPING',
}
