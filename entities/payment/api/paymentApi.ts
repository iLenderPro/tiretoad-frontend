import { baseApi } from '@/shared/api';
import { ItemDto } from '@/entities/payment/api/dto/ItemDto';
import { PaymentIntent } from '@/entities/payment/api/dto/PaymentIntent';
import { Payment } from '@/entities/payment/api/dto/Payment';

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getIntent: build.query<PaymentIntent, string>({
      query: (paymentIntentId) => ({
        url: `/payments/intent/${paymentIntentId}`,
      }),
    }),
    createIntent: build.mutation<PaymentIntent, ItemDto>({
      query: (item) => ({
        url: `/payments/intent`,
        method: 'POST',
        body: item,
      }),
    }),
    createPayment: build.mutation<void, { serviceRequestId: string; paymentIntentId: string }>({
      query: (dto) => ({
        url: `/payments/payment`,
        method: 'POST',
        body: dto,
      }),
    }),
    completePayment: build.mutation<void, { payment: Partial<Payment> }>({
      query: (dto) => ({
        url: `/payments/payment/complete`,
        method: 'PUT',
        body: dto,
      }),
    }),
  }),
});

export const { useCreateIntentMutation, useGetIntentQuery, useCreatePaymentMutation, useCompletePaymentMutation } = paymentApi;
