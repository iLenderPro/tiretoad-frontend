import { Container } from '@mui/material';
import type { Metadata } from 'next';
import CheckoutForm from '@/features/ui/client/payment/CheckoutForm';

export const metadata: Metadata = {
  title: `Payment - TireToad`,
  description: `Get your flat tire fixed in 30 minutes or less. Connect with a mobile tire repair service right in your area instantly.`,
};

export default function Payment() {
  return (
    <Container style={{ display: 'flex', flex: 1, paddingTop: '24px' }}>
      <CheckoutForm />
    </Container>
  );
}
