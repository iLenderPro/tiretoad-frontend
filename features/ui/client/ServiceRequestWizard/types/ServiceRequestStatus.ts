import { ServiceRequestStatus } from '@/entities/serviceRequest/api/dto/ServiceRequestStatus';
import { BadgeOwnProps } from '@mui/material/Badge/Badge';

export const ServiceRequestStatusColorMap: Record<ServiceRequestStatus, BadgeOwnProps['color']> = {
  [ServiceRequestStatus.PENDING]: 'warning',
  [ServiceRequestStatus.PAID]: 'success',
  [ServiceRequestStatus.IN_PROGRESS]: 'primary',
  [ServiceRequestStatus.COMPLETED]: 'secondary',
};
