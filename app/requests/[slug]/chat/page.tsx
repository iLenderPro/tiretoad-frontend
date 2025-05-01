'use client';
import { Container } from '@mui/material';
import { useGetServiceRequestQuery } from '@/entities/serviceRequest/api/serviceRequestApi';
import { skipToken } from '@reduxjs/toolkit/query';
import React from 'react';
import TowingRequestChatAgent from '@/features/ui/agent/TowingRequestChatAgent/TowingRequestChatAgent';
import { TowingRequest } from '@/entities/serviceRequest/api/dto/TowingRequest';
import { useSelector } from 'react-redux';
import { selectUserSession } from '@/entities/account/authSlice';
import { UserRole } from '@/entities/user/api/dto/UserRole';
import TowingRequestChatClient from '@/features/ui/client/TowingRequestChatClient/TowingRequestChatClient';

export default function ServiceRequestChatPage({ params }: { params: { slug: string } }) {
  const { data: serviceRequest } = useGetServiceRequestQuery(params.slug || skipToken, { skip: !params.slug });
  const session = useSelector(selectUserSession);
  // const [updateVendorResponse, { isLoading }] = useUpdateVendorResponseMutation();

  // const handleAcceptRequest = async () => {
  //   vendorResponse && (await updateVendorResponse({ id: vendorResponse.id, status: VendorResponseStatus.ACCEPTED }));
  // };
  //
  // const handleDeclineRequest = async () => {
  //   vendorResponse && (await updateVendorResponse({ id: vendorResponse.id, status: VendorResponseStatus.DECLINED }));
  // };

  return serviceRequest && session.user ? (
    <Container style={{ height: '100%', paddingTop: '24px' }}>
      {session.user.role === UserRole.CLIENT && <TowingRequestChatClient serviceRequest={serviceRequest as TowingRequest} />}
      {session.user.role === UserRole.AGENT && <TowingRequestChatAgent serviceRequest={serviceRequest as TowingRequest} />}
    </Container>
  ) : (
    <></>
  );
}
