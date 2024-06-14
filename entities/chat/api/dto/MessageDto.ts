import { ClientDto } from '@/entities/user/api/dto/ClientDto';
import { VendorResponseDto } from '@/entities/vendorResponse/api/dto/VendorResponseDto';

export interface MessageDto {
  id: string;
  role: string;
  content: string;
  attachment?: string;
  createdAt: number;
  response: VendorResponseDto;
  user: ClientDto;
}
