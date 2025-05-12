'use client';
import { Container, Stack } from '@mui/material';
import { useGetServiceRequestsQuery } from '@/entities/serviceRequest/api/serviceRequestApi';
import Typography from '@mui/material/Typography';
import ServiceRequestResponseTable from '@/features/ui/ServiceRequestResponseTable/ServiceRequestResponseTable';
import { useSelector } from 'react-redux';
import { selectUserSession } from '@/entities/account/authSlice';
import { UserRole } from '@/entities/user/api/dto/UserRole';

export default function ServiceRequests() {
  const { data: serviceRequests, isFetching } = useGetServiceRequestsQuery();
  const session = useSelector(selectUserSession);
  return (
    <>
      <main style={{ height: '100%' }}>
        <Container style={{ height: '100%', paddingTop: '16px' }}>
          <Stack alignItems="center" gap={5}>
            <Typography variant="h3">All Service Requests</Typography>
            {serviceRequests?.length && session.user?.role === UserRole.AGENT && <ServiceRequestResponseTable serviceRequests={serviceRequests} />}
          </Stack>
        </Container>
      </main>
    </>
  );
}
