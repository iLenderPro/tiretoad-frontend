import { UserDto } from '@/entities/user/api/dto/UserDto';

export interface VendorDto extends UserDto {
  businessName: string;
}
