'use client';
import { Container } from '@mui/material';
import TowingRequestPreviewClient from '@/features/ui/client/TowingRequestPreviewClient/TowingRequestPreviewClient';
import TowingRequestPreviewAgent from '@/features/ui/agent/TowingRequestPreviewAgent/TowingRequestPreviewAgent';
import { useSelector } from 'react-redux';
import { selectUserSession } from '@/entities/account/authSlice';
import { UserRole } from '@/entities/user/api/dto/UserRole';

export default function ServiceRequestViewPage({ params }: { params: { slug: string } }) {
  const session = useSelector(selectUserSession);

  return (
    <Container style={{ height: '100%', paddingTop: '24px' }}>
      {session.user?.role === UserRole.CLIENT && <TowingRequestPreviewClient serviceRequestId={params.slug} />}
      {session.user?.role === UserRole.AGENT && <TowingRequestPreviewAgent serviceRequestId={params.slug} />}
    </Container>
  );
}
