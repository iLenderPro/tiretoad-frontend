'use client';
import { Container, Stack } from '@mui/material';
import ServiceRequestTableClient from '@/features/ui/client/ServiceRequestTableClient/ServiceRequestTableClient';
import ServiceRequestTableVendor from '@/features/ui/vendor/ServiceRequestTableVendor/ServiceRequestTableVendor';
import Typography from '@mui/material/Typography';
import { useSelector } from 'react-redux';
import { selectUserSession } from '@/entities/account/authSlice';
import { UserRole } from '@/entities/user/api/dto/UserRole';

export default function ServiceRequestsPage() {
  const session = useSelector(selectUserSession);
  return (
    <Container style={{ display: 'flex', flex: 1, paddingTop: '24px' }}>
      <Stack flex="1" alignItems="center" gap={5}>
        <Typography variant="h4">All Service Requests</Typography>
        {session?.user?.role === UserRole.CLIENT && <ServiceRequestTableClient />}
        {session?.user?.role === UserRole.VENDOR && <ServiceRequestTableVendor />}
      </Stack>
    </Container>
  );
}
