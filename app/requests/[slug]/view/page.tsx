'use client';
import { Container, Stack } from '@mui/material';
import ServiceRequestPreview from '@/features/ui/client/ServiceRequestPreview/ServiceRequestPreview';
import { useGetServiceRequestQuery } from '@/entities/serviceRequest/api/serviceRequestApi';
import { useSelector } from 'react-redux';
import { selectUserSession } from '@/entities/account/authSlice';
import Typography from '@mui/material/Typography';

export default function ServiceRequestView({ params }: { params: { slug: string } }) {
  const session = useSelector(selectUserSession);
  const { data: serviceRequest, isFetching } = useGetServiceRequestQuery(params.slug);

  return (
    <>
      <main style={{ height: '100%' }}>
        <Container style={{ height: '100%', paddingTop: '16px' }}>
          <Stack alignItems="center" minHeight="100%" gap={3} flex={1}>
            <Typography variant="h4">Service Request Summary</Typography>
            {serviceRequest && session?.user && <ServiceRequestPreview user={session?.user} serviceRequest={serviceRequest} />}
          </Stack>
        </Container>
      </main>
    </>
  );
}
