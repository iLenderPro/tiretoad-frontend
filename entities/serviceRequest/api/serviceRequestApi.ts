import { baseApi } from '@/shared/api';
import { ServiceRequestDto } from '@/entities/serviceRequest/api/dto/ServiceRequestDto';

export const serviceRequestApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getServiceRequests: build.query<ServiceRequestDto[], void>({
      query: () => {
        return {
          url: 'service-requests',
        };
      },
    }),
    getServiceRequest: build.query<ServiceRequestDto, string>({
      query: (id) => {
        return {
          url: `service-requests/${id}`,
        };
      },
    }),
    createServiceRequest: build.mutation<ServiceRequestDto, ServiceRequestDto>({
      query: (serviceRequestDto) => {
        return {
          url: `service-requests`,
          method: 'POST',
          body: serviceRequestDto,
        };
      },
    }),
  }),
});

export const { useCreateServiceRequestMutation, useGetServiceRequestsQuery, useGetServiceRequestQuery } = serviceRequestApi;
