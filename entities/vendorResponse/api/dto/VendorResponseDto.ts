import { ClientDto } from '@/entities/user/api/dto/ClientDto';
import { ServiceRequestDto } from '@/entities/serviceRequest/api/dto/ServiceRequestDto';
import { MessageDto } from '@/entities/chat/api/dto/MessageDto';
import { VendorResponseStatus } from '@/entities/vendorResponse/api/dto/VendorResponseStatus';

export type VendorResponseDto = {
  id: string;
  status: VendorResponseStatus;
  vendor: ClientDto;
  serviceRequest: ServiceRequestDto;
  messages: MessageDto[];
};
