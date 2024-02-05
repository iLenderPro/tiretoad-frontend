import { baseApi } from '@/shared/api';
import { MessageDto } from './dto/MessageDto';
import { UserDto } from '@/entities/user/api/dto/UserDto';
import { VendorResponseDto } from '@/entities/vendorResponse/api/dto/VendorResponseDto';

export const chatApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getMessage: build.query<MessageDto[], string>({
      query: (vendorResponseId) => ({
        url: `/chat/messages/${vendorResponseId}`,
      }),
    }),
    sendMessage: build.mutation<MessageDto, { vendorResponse: VendorResponseDto; user: UserDto; prompt: string }>({
      query: ({ vendorResponse, user, prompt }) => ({
        url: `/chat/messages/${vendorResponse.id}`,
        method: 'POST',
        body: { response: vendorResponse, user, content: prompt },
      }),
    }),
  }),
});

export const { useGetMessageQuery, useSendMessageMutation } = chatApi;
