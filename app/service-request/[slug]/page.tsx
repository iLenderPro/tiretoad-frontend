import { Container } from '@mui/material';
import ServiceRequestOverview from '@/features/ui/ServiceRequestOverview/ServiceRequestOverview';

export default function ServiceRequest({ params }: { params: { slug: string } }) {
  return (
    <>
      <main style={{ height: '100%' }}>
        <Container style={{ height: '100%', paddingTop: '16px' }}>
          <ServiceRequestOverview id={params.slug} />
        </Container>
      </main>
    </>
  );
}
