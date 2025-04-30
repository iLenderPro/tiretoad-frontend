'use client';
import { Container, Stack } from '@mui/material';
import { selectUserSession } from '@/entities/account/authSlice';
import { useSelector } from 'react-redux';
import { useGetServiceRequestQuery } from '@/entities/serviceRequest/api/serviceRequestApi';
import { skipToken } from '@reduxjs/toolkit/query';
import { RequestChat } from '@/shared/ui/Chat/RequestChat';
import TowingRequestSummary from '@/features/ui/client/TowingRequestSummary/TowingRequestSummary';
import React from 'react';
import { TowingRequest } from '@/entities/serviceRequest/api/dto/TowingRequest';

export default function ServiceRequestChatPage({ params }: { params: { slug: string } }) {
  const session = useSelector(selectUserSession);
  const { data: serviceRequest } = useGetServiceRequestQuery(params.slug || skipToken, { skip: !params.slug });
  // const [updateVendorResponse, { isLoading }] = useUpdateVendorResponseMutation();

  // const handleAcceptRequest = async () => {
  //   vendorResponse && (await updateVendorResponse({ id: vendorResponse.id, status: VendorResponseStatus.ACCEPTED }));
  // };
  //
  // const handleDeclineRequest = async () => {
  //   vendorResponse && (await updateVendorResponse({ id: vendorResponse.id, status: VendorResponseStatus.DECLINED }));
  // };

  return (
    <>
      <Container style={{ height: '100%', paddingTop: '24px' }}>
        <Stack alignItems="center" minHeight="100%" gap={3}>
          {serviceRequest && session?.user && (
            <Stack direction="row" display="flex" flexWrap="wrap" gap={3} width={1}>
              <Stack alignItems="center" minHeight="100%" gap={3} flex={1}>
                <TowingRequestSummary serviceRequest={serviceRequest as TowingRequest} />
              </Stack>
              <RequestChat user={session.user} serviceRequest={serviceRequest} />
            </Stack>
          )}
        </Stack>
      </Container>
    </>
  );
}
