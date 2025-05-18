'use client';
import { Container } from '@mui/material';
import CheckoutForm from '@/features/ui/client/payment/CheckoutForm';
import { useGetServiceRequestQuery } from '@/entities/serviceRequest/api/serviceRequestApi';
import { skipToken } from '@reduxjs/toolkit/query';
import { useSelector } from 'react-redux';
import { selectUserSession } from '@/entities/account/authSlice';

export default function Payment({ params }: { params: { slug: string } }) {
  const { data: serviceRequest } = useGetServiceRequestQuery(params.slug || skipToken, { skip: !params.slug });
  const session = useSelector(selectUserSession);
  return <Container style={{ display: 'flex', flex: 1, paddingTop: '24px' }}>{serviceRequest && <CheckoutForm serviceRequest={serviceRequest} />}</Container>;
}
