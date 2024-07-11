'use client';
import { Container, Stack } from '@mui/material';
import { useGetServiceRequestsQuery } from '@/entities/serviceRequest/api/serviceRequestApi';
import Typography from '@mui/material/Typography';
import ServiceRequestResponseTable from '@/features/ui/ServiceRequestResponseTable/ServiceRequestResponseTable';

export default function ServiceRequests() {
  const { data: serviceRequests, isFetching } = useGetServiceRequestsQuery();
  return (
    <>
      <main style={{ height: '100%' }}>
        <Container style={{ height: '100%', paddingTop: '16px' }}>
          <Stack alignItems="center" gap={5}>
            <Typography variant="h3">All Service Requests</Typography>
            {serviceRequests?.length && <ServiceRequestResponseTable serviceRequests={serviceRequests} />}
          </Stack>
        </Container>
      </main>
    </>
  );
}
