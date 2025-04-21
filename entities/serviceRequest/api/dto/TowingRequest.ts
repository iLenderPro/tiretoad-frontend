import { ServiceRequest } from '@/entities/serviceRequest/api/dto/ServiceRequest';

export interface TowingRequest extends ServiceRequest {
  locationDropOff: {
    latitude: string;
    longitude: string;
    address: string;
    comment: string;
  };
  canGoNeutral: boolean;
  tiresInflated: boolean;
}
