import { MessageDto } from '@/entities/chat/api/dto/MessageDto';
import { VendorResponseStatus } from '@/entities/vendorResponse/api/dto/VendorResponseStatus';
import { VendorDto } from '@/entities/user/api/dto/VendorDto';
import { TireRepairRequest } from '@/entities/serviceRequest/api/dto/TireRepairRequest';

export type VendorResponseDto = {
  id: string;
  status: VendorResponseStatus;
  vendor: VendorDto;
  serviceRequest: TireRepairRequest;
  messages: MessageDto[];
};
