'use client';
import React, { memo } from 'react';
import TowingRequestSummary from '@/features/ui/client/TowingRequestSummary/TowingRequestSummary';
import { Stack } from '@mui/material';
import RespondedVendorsList from '@/features/ui/agent/RespondedVendorsList/RespondedVendorsList';
import { useGetServiceRequestQuery } from '@/entities/serviceRequest/api/serviceRequestApi';
import { skipToken } from '@reduxjs/toolkit/query';
import { TowingRequest } from '@/entities/serviceRequest/api/dto/TowingRequest';

export type ServiceRequestPreviewProps = {
  serviceRequestId: string;
};

function TowingRequestPreviewAgent({ serviceRequestId }: ServiceRequestPreviewProps) {
  const { data: serviceRequest, isFetching } = useGetServiceRequestQuery(serviceRequestId || skipToken, { skip: !serviceRequestId });

  return serviceRequest ? (
    <Stack gap={2}>
      <TowingRequestSummary serviceRequest={serviceRequest as TowingRequest} />
      <RespondedVendorsList serviceRequestId={serviceRequest.id!} />
    </Stack>
  ) : (
    <></>
  );
}

export default memo(TowingRequestPreviewAgent);
