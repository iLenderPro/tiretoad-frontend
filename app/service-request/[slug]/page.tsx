import { Container } from '@mui/material';
import ServiceRequestView from '@/features/ui/ServiceRequestView/ServiceRequestView';

export default function ServiceRequest({ params }: { params: { slug: string } }) {
  return (
    <>
      <main style={{ height: '100%' }}>
        <Container style={{ height: '100%', paddingTop: '16px' }}>
          <ServiceRequestView id={params.slug} />
        </Container>
      </main>
    </>
  );
}
