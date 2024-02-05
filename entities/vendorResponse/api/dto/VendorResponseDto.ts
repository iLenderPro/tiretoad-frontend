import { UserDto } from '@/entities/user/api/dto/UserDto';
import { ServiceRequestDto } from '@/entities/serviceRequest/api/dto/ServiceRequestDto';
import { MessageDto } from '@/entities/chat/api/dto/MessageDto';

export type VendorResponseDto = {
  id: string;
  vendor: UserDto;
  serviceRequest: ServiceRequestDto;
  messages: MessageDto[];
};
