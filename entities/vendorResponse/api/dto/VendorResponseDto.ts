import { ServiceRequestDto } from '@/entities/serviceRequest/api/dto/ServiceRequestDto';
import { MessageDto } from '@/entities/chat/api/dto/MessageDto';
import { VendorResponseStatus } from '@/entities/vendorResponse/api/dto/VendorResponseStatus';
import { VendorDto } from '@/entities/user/api/dto/VendorDto';

export type VendorResponseDto = {
  id: string;
  status: VendorResponseStatus;
  vendor: VendorDto;
  serviceRequest: ServiceRequestDto;
  messages: MessageDto[];
};
