import { baseApi } from '@/shared/api';
import { MessageDto } from './dto/MessageDto';
import { ClientDto } from '@/entities/user/api/dto/ClientDto';
import { VendorResponseDto } from '@/entities/vendorResponse/api/dto/VendorResponseDto';

export const chatApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getMessage: build.query<MessageDto[], string>({
      query: (vendorResponseId) => ({
        url: `/chat/messages/${vendorResponseId}`,
      }),
    }),
    sendMessage: build.mutation<MessageDto, { vendorResponse: VendorResponseDto; user: ClientDto; prompt: string }>({
      query: ({ vendorResponse, user, prompt }) => ({
        url: `/chat/messages/${vendorResponse.id}`,
        method: 'POST',
        body: { response: vendorResponse, user, content: prompt },
      }),
    }),
    getUnreadMessages: build.query<MessageDto[], void>({
      query: () => ({
        url: `/chat/unread`,
      }),
    }),
    markAsRead: build.mutation<void, string>({
      query: (responseId) => ({
        url: `/chat/messages/${responseId}`,
        method: 'PUT',
      }),
    }),
  }),
});

export const { useGetMessageQuery, useGetUnreadMessagesQuery, useMarkAsReadMutation, useSendMessageMutation } = chatApi;
