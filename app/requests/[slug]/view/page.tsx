'use client';
import { Container } from '@mui/material';
import { useGetServiceRequestQuery } from '@/entities/serviceRequest/api/serviceRequestApi';
import TowingRequestPreviewClient from '@/features/ui/client/TowingRequestPreviewClient/TowingRequestPreviewClient';
import TowingRequestPreviewAgent from '@/features/ui/agent/TowingRequestPreviewAgent/TowingRequestPreviewAgent';
import { TowingRequest } from '@/entities/serviceRequest/api/dto/TowingRequest';
import { useSelector } from 'react-redux';
import { selectUserSession } from '@/entities/account/authSlice';
import { UserRole } from '@/entities/user/api/dto/UserRole';

export default function ServiceRequestViewPage({ params }: { params: { slug: string } }) {
  const { data: serviceRequest, isFetching } = useGetServiceRequestQuery(params.slug);
  const session = useSelector(selectUserSession);

  return serviceRequest ? (
    <Container style={{ height: '100%', paddingTop: '24px' }}>
      {serviceRequest && session.user?.role === UserRole.CLIENT && <TowingRequestPreviewClient serviceRequest={serviceRequest as TowingRequest} />}
      {serviceRequest && session.user?.role === UserRole.AGENT && <TowingRequestPreviewAgent serviceRequest={serviceRequest as TowingRequest} />}
    </Container>
  ) : (
    <></>
  );
}
