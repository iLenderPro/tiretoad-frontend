'use client';
import { ClientDto } from '@/entities/user/api/dto/ClientDto';
import React, { memo, useState } from 'react';
import TowingRequestSummary from '@/features/ui/client/TowingRequestSummary/TowingRequestSummary';
import { TowingRequest } from '@/entities/serviceRequest/api/dto/TowingRequest';

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
  return serviceRequest ? <TowingRequestSummary serviceRequest={serviceRequest} /> : <></>;
}

export default memo(TowingRequestPreview);
