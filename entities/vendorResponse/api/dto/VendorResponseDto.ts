import { UserDto } from '@/entities/user/api/dto/UserDto';
import { ServiceRequestDto } from '@/entities/serviceRequest/api/dto/ServiceRequestDto';
import { MessageDto } from '@/entities/chat/api/dto/MessageDto';
import { VendorResponseStatus } from '@/entities/vendorResponse/api/dto/VendorResponseStatus';

export type VendorResponseDto = {
  id: string;
  status: VendorResponseStatus;
  vendor: UserDto;
  serviceRequest: ServiceRequestDto;
  messages: MessageDto[];
};
