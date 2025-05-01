'use client';
import React, { memo } from 'react';
import TowingRequestSummary from '@/features/ui/client/TowingRequestSummary/TowingRequestSummary';
import { TowingRequest } from '@/entities/serviceRequest/api/dto/TowingRequest';
import { Stack } from '@mui/material';
import { RequestChat } from '@/shared/ui/Chat/RequestChat';
import { useSelector } from 'react-redux';
import { selectUserSession } from '@/entities/account/authSlice';

export type ServiceRequestChatProps = {
  serviceRequest: TowingRequest;
};

function TowingRequestChatClient(props: ServiceRequestChatProps) {
  const { serviceRequest } = props;
  const session = useSelector(selectUserSession);

  return serviceRequest && session.user ? (
    <Stack gap={2}>
      <TowingRequestSummary serviceRequest={serviceRequest} />
      <RequestChat user={session.user} serviceRequest={serviceRequest} />
    </Stack>
  ) : (
    <></>
  );
}

export default memo(TowingRequestChatClient);
