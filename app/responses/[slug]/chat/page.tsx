'use client';
import { Container, Stack } from '@mui/material';
import { Chat } from '@/shared/ui/Chat/Chat';
import ServiceRequestPreview from '@/features/ui/client/ServiceRequestPreview/ServiceRequestPreview';
import { useGetVendorResponseQuery } from '@/entities/vendorResponse/api/vendorResponseApi';
import { selectUserSession } from '@/entities/account/authSlice';
import { useSelector } from 'react-redux';

export default function ServiceRequestChat({ params }: { params: { slug: string } }) {
  const session = useSelector(selectUserSession);
  const { data: vendorResponse, isFetching } = useGetVendorResponseQuery(params.slug);

  return (
    <>
      <main style={{ height: '100%' }}>
        <Container style={{ height: '100%', paddingTop: '16px' }}>
          <Stack alignItems="center" minHeight="100%" gap={3}>
            {vendorResponse?.serviceRequest && session?.user && (
              <Stack direction="row" display="flex" flexWrap="wrap" gap={3} width={1}>
                <ServiceRequestPreview user={session.user} serviceRequest={vendorResponse?.serviceRequest} />
                <Chat user={session.user} vendorResponse={vendorResponse} />
              </Stack>
            )}
          </Stack>
        </Container>
      </main>
    </>
  );
}
