import { baseApi } from '@/shared/api';
import { ClientSecret } from '@/entities/payment/api/dto/ClientSecret';
import { ItemDto } from '@/entities/payment/api/dto/ItemDto';
import { PaymentIntent } from '@/entities/payment/api/dto/PaymentIntent';

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getIntent: build.query<PaymentIntent, string>({
      query: (paymentIntentId) => ({
        url: `/payments/intent/${paymentIntentId}`,
      }),
    }),
    createIntent: build.mutation<ClientSecret, ItemDto>({
      query: (item) => ({
        url: `/payments/intent`,
        method: 'POST',
        body: item,
      }),
    }),
  }),
});

export const { useCreateIntentMutation, useGetIntentQuery } = paymentApi;
