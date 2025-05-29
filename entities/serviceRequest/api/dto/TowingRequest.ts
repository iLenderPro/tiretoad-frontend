import { ServiceRequest } from '@/entities/serviceRequest/api/dto/ServiceRequest';

export interface TowingRequest extends ServiceRequest {
  locationDropOff: {
    latitude: string;
    longitude: string;
    address?: string;
    comment?: string;
  };
  distance: number;
  canGoNeutral: boolean;
  tiresInflated: boolean;
}
