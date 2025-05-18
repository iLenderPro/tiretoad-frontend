import { BadgeOwnProps } from '@mui/material/Badge/Badge';
import { VendorResponseStatus } from '@/entities/vendorResponse/api/dto/VendorResponseStatus';

export const VendorResponseStatusColorMap: Record<VendorResponseStatus, BadgeOwnProps['color']> = {
  [VendorResponseStatus.SENT]: 'secondary',
  [VendorResponseStatus.QUOTED]: 'info',
  [VendorResponseStatus.PENDING]: 'warning',
  [VendorResponseStatus.PAID]: 'success',
  [VendorResponseStatus.IN_PROGRESS]: 'primary',
  [VendorResponseStatus.PICK_UP_VALIDATED]: 'info',
  [VendorResponseStatus.DROP_OFF_VALIDATED]: 'info',
  [VendorResponseStatus.COMPLETED]: 'secondary',
};
