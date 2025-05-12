'use client';
import React, { memo } from 'react';
import TowingRequestSummary from '@/features/ui/client/TowingRequestSummary/TowingRequestSummary';
import { TowingRequest } from '@/entities/serviceRequest/api/dto/TowingRequest';
import { Stack } from '@mui/material';
import RespondedVendorsList from '@/features/ui/agent/RespondedVendorsList/RespondedVendorsList';

export type ServiceRequestPreviewProps = {
  serviceRequest: TowingRequest;
};

function TowingRequestPreviewAgent(props: ServiceRequestPreviewProps) {
  const { serviceRequest } = props;
  return serviceRequest ? (
    <Stack gap={2}>
      <TowingRequestSummary serviceRequest={serviceRequest} />
      <RespondedVendorsList serviceRequestId={serviceRequest.id!} />
    </Stack>
  ) : (
    <></>
  );
}

export default memo(TowingRequestPreviewAgent);
