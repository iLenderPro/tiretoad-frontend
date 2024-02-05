import { UserDto } from '@/entities/user/api/dto/UserDto';
import { ServiceRequestDto } from '@/entities/serviceRequest/api/dto/ServiceRequestDto';

export interface MessageDto {
  id: string;
  role: string;
  content: string;
  attachment?: string;
  createdAt: number;
  serviceRequest: ServiceRequestDto;
  user: UserDto;
}
