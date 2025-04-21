import { ServiceRequest } from '@/entities/serviceRequest/api/dto/ServiceRequest';

export interface TireRepairRequest extends ServiceRequest {
  tires: {
    damage: string;
    side: string;
    size?: string;
    type?: string;
    imageOfDamage?: string;
    imageOfTireWall?: string;
  }[];
}
