import { ClientDto } from '@/entities/user/api/dto/ClientDto';
import { VendorResponseDto } from '@/entities/vendorResponse/api/dto/VendorResponseDto';
import { ServiceRequest } from '@/entities/serviceRequest/api/dto/ServiceRequest';

export interface MessageDto {
  id: string;
  content: string;
  attachment?: string;
  createdAt: number;
  request?: ServiceRequest;
  response?: VendorResponseDto;
  user: ClientDto;
}
