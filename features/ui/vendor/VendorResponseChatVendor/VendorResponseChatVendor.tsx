'use client';
import React, { memo } from 'react';
import TowingRequestSummary from '@/features/ui/client/TowingRequestSummary/TowingRequestSummary';
import { Stack } from '@mui/material';
import { useSelector } from 'react-redux';
import { selectUserSession } from '@/entities/account/authSlice';
import { VendorResponseDto } from '@/entities/vendorResponse/api/dto/VendorResponseDto';
import { TowingRequest } from '@/entities/serviceRequest/api/dto/TowingRequest';
import { ResponseChat } from '@/shared/ui/Chat/ResponseChat';
import AssignedAgentsVendor from '@/features/ui/vendor/AssignedAgentsVendor/AssignedAgentsVendor';

export type VendorResponseChatProps = {
  vendorResponse: VendorResponseDto;
};

function VendorResponseChatVendor(props: VendorResponseChatProps) {
  const { vendorResponse } = props;
  const session = useSelector(selectUserSession);

  return vendorResponse && session.user ? (
    <Stack gap={2}>
      <TowingRequestSummary serviceRequest={vendorResponse.serviceRequest as TowingRequest} vendorResponse={vendorResponse} />
      <AssignedAgentsVendor serviceRequestId={vendorResponse.serviceRequest.id!} vendorResponseId={vendorResponse.id} />
      <ResponseChat user={session.user} vendorResponse={vendorResponse} />
    </Stack>
  ) : (
    <></>
  );
}

export default memo(VendorResponseChatVendor);
