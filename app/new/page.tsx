import { Container } from '@mui/material';
import type { Metadata } from 'next';
import TowingRequestWizard from '@/features/ui/client/TowingRequestWizard/TowingRequestWizard';

export const metadata: Metadata = {
  title: `Mobile tire repair shops - TireToad`,
  description: `Get your flat tire fixed in 30 minutes or less. Connect with a mobile tire repair service right in your area instantly.`,
};

export default function Home() {
  return (
    <Container style={{ display: 'flex', flex: 1, paddingTop: '24px', paddingBottom: '24px' }}>
      <TowingRequestWizard />
    </Container>
  );
}
