'use client';
import React, { memo } from 'react';
import TowingRequestSummary from '@/features/ui/client/TowingRequestSummary/TowingRequestSummary';
import { TowingRequest } from '@/entities/serviceRequest/api/dto/TowingRequest';
import { Button, Stack } from '@mui/material';
import { RequestChat } from '@/shared/ui/Chat/RequestChat';
import { useSelector } from 'react-redux';
import { selectUserSession } from '@/entities/account/authSlice';
import Typography from '@mui/material/Typography';
import RespondedVendorsList from '@/features/ui/agent/RespondedVendorsList/RespondedVendorsList';

export type ServiceRequestChatProps = {
  serviceRequest: TowingRequest;
};

function TowingRequestChatAgent(props: ServiceRequestChatProps) {
  const { serviceRequest } = props;
  const session = useSelector(selectUserSession);

  return serviceRequest && session.user ? (
    <Stack gap={2}>
      <TowingRequestSummary serviceRequest={serviceRequest} />
      <Stack direction="row" width={1} justifyContent="space-between" alignItems="center">
        <Typography variant="body2" fontWeight="600">
          {serviceRequest.responses?.length} Vendor Quote
        </Typography>
        <Button disableElevation variant="contained" size="small">
          Select vendor
        </Button>
      </Stack>
      <RespondedVendorsList serviceRequestId={serviceRequest.id!} />
      <RequestChat user={session.user} serviceRequest={serviceRequest} />
    </Stack>
  ) : (
    <></>
  );
}

export default memo(TowingRequestChatAgent);
