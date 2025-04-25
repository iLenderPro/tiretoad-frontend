'use client';
import { Container, Stack } from '@mui/material';
import { useGetServiceRequestQuery } from '@/entities/serviceRequest/api/serviceRequestApi';
import { useSelector } from 'react-redux';
import { selectUserSession } from '@/entities/account/authSlice';
import TowingRequestPreview from '@/features/ui/client/TowingRequestPreview/TowingRequestPreview';
import { TowingRequest } from '@/entities/serviceRequest/api/dto/TowingRequest';

export default function ServiceRequestViewPage({ params }: { params: { slug: string } }) {
  const session = useSelector(selectUserSession);
  const { data: serviceRequest, isFetching } = useGetServiceRequestQuery(params.slug);

  return (
    <>
      <Container style={{ height: '100%', paddingTop: '24px' }}>
        <Stack alignItems="center" minHeight="100%" gap={3} flex={1}>
          {serviceRequest && session?.user && <TowingRequestPreview user={session?.user} serviceRequest={serviceRequest as TowingRequest} />}
        </Stack>
      </Container>
    </>
  );
}
