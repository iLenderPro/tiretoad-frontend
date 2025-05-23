'use client';
import React, { memo } from 'react';
import TowingRequestSummary from '@/features/ui/client/TowingRequestSummary/TowingRequestSummary';
import AssignedAgentsList from '@/features/ui/client/AssignedAgentsList/AssignedAgentsList';
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/material';
import { useGetServiceRequestQuery } from '@/entities/serviceRequest/api/serviceRequestApi';
import { skipToken } from '@reduxjs/toolkit/query';
import { TowingRequest } from '@/entities/serviceRequest/api/dto/TowingRequest';

export type ServiceRequestPreviewProps = {
  serviceRequestId?: string;
};

function TowingRequestPreviewClient({ serviceRequestId }: ServiceRequestPreviewProps) {
  const { data: serviceRequest, isFetching } = useGetServiceRequestQuery(serviceRequestId || skipToken, { skip: !serviceRequestId });
  return serviceRequest ? (
    <Stack gap={2}>
      <Typography variant="subtitle2" fontWeight="700">
        Good News! <br />
        Your tow truck is ready and the dispatcher is waiting to assist you.
      </Typography>
      <AssignedAgentsList serviceRequestId={serviceRequest.id!} />
      <TowingRequestSummary serviceRequest={serviceRequest as TowingRequest} />
    </Stack>
  ) : (
    <></>
  );
}

export default memo(TowingRequestPreviewClient);
