import { ClientDto } from '@/entities/user/api/dto/ClientDto';
import { VendorResponseDto } from '@/entities/vendorResponse/api/dto/VendorResponseDto';
import { UserDto } from '@/entities/user/api/dto/UserDto';
import { ServiceRequestStatus } from '@/entities/serviceRequest/api/dto/ServiceRequestStatus';

export interface ServiceRequest {
  id?: string;
  status: ServiceRequestStatus;
  price: number;
  eta: string;
  vehicle: {
    vin?: string;
    year: string;
    make: string;
    model: string;
    trim: string;
  };
  location: {
    latitude: string;
    longitude: string;
    address?: string;
    comment?: string;
  };
  urgency: string;
  createdAt?: string;
  prettyTime?: string;
  client: ClientDto;
  responses?: VendorResponseDto[];
  agent: UserDto;
}
