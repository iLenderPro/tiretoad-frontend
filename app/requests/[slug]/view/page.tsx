'use client';
import { Container } from '@mui/material';
import { useGetServiceRequestQuery } from '@/entities/serviceRequest/api/serviceRequestApi';
import TowingRequestPreview from '@/features/ui/client/TowingRequestPreview/TowingRequestPreview';
import { TowingRequest } from '@/entities/serviceRequest/api/dto/TowingRequest';

export default function ServiceRequestViewPage({ params }: { params: { slug: string } }) {
  const { data: serviceRequest, isFetching } = useGetServiceRequestQuery(params.slug);

  return serviceRequest ? (
    <Container style={{ height: '100%', paddingTop: '24px' }}>
      <TowingRequestPreview serviceRequest={serviceRequest as TowingRequest} />
    </Container>
  ) : (
    <></>
  );
}
