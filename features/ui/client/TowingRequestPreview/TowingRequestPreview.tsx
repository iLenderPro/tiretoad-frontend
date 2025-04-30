'use client';
import { ClientDto } from '@/entities/user/api/dto/ClientDto';
import React, { memo, useState } from 'react';
import TowingRequestSummary from '@/features/ui/client/TowingRequestSummary/TowingRequestSummary';
import { TowingRequest } from '@/entities/serviceRequest/api/dto/TowingRequest';
import AssignedAgentsList from '@/features/ui/client/AssignedAgentsList/AssignedAgentsList';
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/material';

export type ServiceRequestPreviewProps = {
  serviceRequest: TowingRequest;
  user: ClientDto;
};

function TowingRequestPreview(props: ServiceRequestPreviewProps) {
  const { serviceRequest } = props;
  const [open, setOpen] = useState(false);
  const toggleDialog = () => {
    setOpen((prevState) => !prevState);
  };
  return serviceRequest ? (
    <Stack gap={2}>
      <Typography variant="subtitle2" fontWeight="700">
        Good News! <br />A tow truck is ready for you. Let’s discuss on chat.
      </Typography>
      <AssignedAgentsList serviceRequestId={serviceRequest.id!} />
      <TowingRequestSummary serviceRequest={serviceRequest} />
    </Stack>
  ) : (
    <></>
  );
}

export default memo(TowingRequestPreview);
