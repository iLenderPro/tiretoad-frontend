import { ServiceRequestDto } from '@/entities/serviceRequest/api/dto/ServiceRequestDto';
import { UserDto } from '@/entities/user/api/dto/UserDto';
import { TransactionStatus } from '@/entities/payment/api/dto/TransactionStatus';
import { TransactionType } from '@/entities/payment/api/dto/TransactionType';

export type Payment = {
  amount: number;
  createdBy: UserDto;
  receiver: UserDto;
  serviceRequest: ServiceRequestDto;
  type: TransactionType.SALE;
  status: TransactionStatus.PENDING | TransactionStatus.COMPLETED | TransactionStatus.FAILED;
  stripeIntentId: string;
};
