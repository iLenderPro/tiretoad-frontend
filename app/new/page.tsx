import { Container } from '@mui/material';
import type { Metadata } from 'next';
import TowingRequestWizard from '@/features/ui/client/TowingRequestWizard/TowingRequestWizard';

export const metadata: Metadata = {
  title: `TireToad guarantees fast, reliable towing service with 30-minute response time.`,
  description: `TireToad’s 24/7 tow truck dispatch app offers fast, reliable help for any roadside emergency. DIY dispatch makes getting assistance easy!`,
};

export default function Home() {
  return (
    <Container style={{ display: 'flex', flex: 1, paddingTop: '24px', paddingBottom: '24px' }}>
      <TowingRequestWizard />
    </Container>
  );
}
