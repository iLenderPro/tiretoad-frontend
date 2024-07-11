import ServiceRequestWizard from '@/features/ui/ServiceRequestWizard/ServiceRequestWizard';
import { Container } from '@mui/material';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: `Mobile tire repair shops - TireToad`,
  description: `Get your flat tire fixed in in 30 minutes or less. Connect with a mobile tire repair service right in your area instantly.`,
};
export default function Home() {
  return (
    <Container style={{ display: 'flex', flex: 1, paddingTop: '24px' }}>
      <ServiceRequestWizard />
    </Container>
  );
}
