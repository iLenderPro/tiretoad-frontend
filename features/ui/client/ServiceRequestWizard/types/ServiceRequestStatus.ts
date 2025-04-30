import { ServiceRequestStatus } from '@/entities/serviceRequest/api/dto/ServiceRequestStatus';
import { BadgeOwnProps } from '@mui/material/Badge/Badge';

export const ServiceRequestStatusColorMap: Record<ServiceRequestStatus, BadgeOwnProps['color']> = {
  [ServiceRequestStatus.PENDING]: 'warning',
  [ServiceRequestStatus.ACCEPTED]: 'info',
  [ServiceRequestStatus.PAID]: 'secondary',
  [ServiceRequestStatus.IN_PROGRESS]: 'primary',
  [ServiceRequestStatus.COMPLETED]: 'success',
};
