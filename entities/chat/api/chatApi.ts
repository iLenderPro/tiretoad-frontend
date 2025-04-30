import { baseApi } from '@/shared/api';
import { MessageDto } from './dto/MessageDto';

export const chatApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getResponseMessages: build.query<MessageDto[], string>({
      query: (vendorResponseId) => ({
        url: `/chat/messages/response/${vendorResponseId}`,
      }),
    }),
    getRequestMessages: build.query<MessageDto[], string>({
      query: (serviceRequestId) => ({
        url: `/chat/messages/request/${serviceRequestId}`,
      }),
    }),
    sendMessage: build.mutation<MessageDto, Partial<MessageDto>>({
      query: (message) => ({
        url: `/chat/messages`,
        method: 'POST',
        body: message,
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

export const { useGetResponseMessagesQuery, useGetRequestMessagesQuery, useSendMessageMutation, useGetUnreadMessagesQuery, useMarkAsReadMutation } = chatApi;
