'use client';
import { Container } from '@mui/material';
import { skipToken } from '@reduxjs/toolkit/query';
import { useSelector } from 'react-redux';
import { selectUserSession } from '@/entities/account/authSlice';
import { UserRole } from '@/entities/user/api/dto/UserRole';
import { useGetVendorResponseQuery } from '@/entities/vendorResponse/api/vendorResponseApi';
import VendorResponseChatAgent from '@/features/ui/agent/VendorResponseChatAgent/VendorResponseChatAgent';
import VendorResponseChatVendor from '@/features/ui/vendor/VendorResponseChatVendor/VendorResponseChatVendor';

export default function VendorResponseChatPage({ params }: { params: { slug: string } }) {
  const { data: vendorResponse } = useGetVendorResponseQuery(params.slug || skipToken, { skip: !params.slug });
  const session = useSelector(selectUserSession);

  return vendorResponse && session.user ? (
    <Container style={{ height: '100%', paddingTop: '24px' }}>
      {session.user.role === UserRole.AGENT && <VendorResponseChatAgent vendorResponse={vendorResponse} />}
      {session.user.role === UserRole.VENDOR && <VendorResponseChatVendor vendorResponse={vendorResponse} />}
    </Container>
  ) : (
    <></>
  );
}
