import ServiceRequestWizard from '@/features/ui/ServiceRequestWizard/ServiceRequestWizard';
import { Container } from '@mui/material';

export default function Home() {
  return (
    <>
      <main style={{ height: '100%' }}>
        <Container style={{ height: '100%' }}>
          <ServiceRequestWizard />
        </Container>
      </main>
    </>
  );
}
