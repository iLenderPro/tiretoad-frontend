import { ClientDto } from '@/entities/user/api/dto/ClientDto';
import { VendorResponseDto } from '@/entities/vendorResponse/api/dto/VendorResponseDto';

export type ServiceRequestDto = {
  id?: string;
  tires: {
    damage: string;
    side: string;
    size?: string;
    type?: string;
    imageOfDamage?: string;
    imageOfTireWall?: string;
  }[];
  vehicle: {
    vin?: string;
    year: string;
    make: string;
    model: string;
    trim: string;
  };
  location: {
    latitude: number;
    longitude: number;
    address: string;
    comment: string;
  };
  urgency: string;
  createdAt?: string;
  client: ClientDto;
  responses?: VendorResponseDto[];
};
