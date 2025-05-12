import { MessageDto } from '@/entities/chat/api/dto/MessageDto';
import { VendorResponseStatus } from '@/entities/vendorResponse/api/dto/VendorResponseStatus';
import { VendorDto } from '@/entities/user/api/dto/VendorDto';
import { ServiceRequestDto } from '@/entities/serviceRequest/api/dto/ServiceRequestDto';

export type VendorResponseDto = {
  id: string;
  status: VendorResponseStatus;
  price: number;
  markup: number;
  vendor: VendorDto;
  serviceRequest: ServiceRequestDto;
  messages: MessageDto[];
};
