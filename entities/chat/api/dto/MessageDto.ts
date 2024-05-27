import { ClientDto } from '@/entities/user/api/dto/ClientDto';
import { ServiceRequestDto } from '@/entities/serviceRequest/api/dto/ServiceRequestDto';

export interface MessageDto {
  id: string;
  role: string;
  content: string;
  attachment?: string;
  createdAt: number;
  serviceRequest: ServiceRequestDto;
  user: ClientDto;
}
