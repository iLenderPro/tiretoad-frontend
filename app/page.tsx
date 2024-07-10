import ServiceRequestWizard from '@/features/ui/ServiceRequestWizard/ServiceRequestWizard';
import { Container } from '@mui/material';

export default function Home() {
  return (
    <Container style={{ display: 'flex', flex: 1, paddingTop: '24px' }}>
      <ServiceRequestWizard />
    </Container>
  );
}
