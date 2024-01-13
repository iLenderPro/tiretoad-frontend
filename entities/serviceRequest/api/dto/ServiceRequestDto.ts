import { UserDto } from '@/entities/user/api/dto/UserDto';

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
    year: number;
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
  user: UserDto;
};
