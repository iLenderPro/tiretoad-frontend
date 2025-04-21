import { Layout, loadStripe } from '@stripe/stripe-js';
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { Stack } from '@mui/material';
import { FormEvent, useState } from 'react';
import Button from '@mui/material/Button';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

export default function PaymentForm({ isLoading }: { isLoading: boolean }) {
  const [message, setMessage] = useState<string | null>();

  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: 'http://localhost:8080/payment/success',
      },
    });

    if (error.type === 'card_error' || error.type === 'validation_error') {
      setMessage(error.message);
    } else {
      setMessage('An unexpected error occurred.');
    }
  };

  const paymentElementOptions = {
    layout: 'accordion' as Layout,
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit} style={{ width: '100%' }}>
      <Stack sx={{ textAlign: 'center' }} flexGrow={1} justifyContent="space-between" minHeight="100%">
        <PaymentElement id="payment-element" options={paymentElementOptions} />
        <Button variant="contained" disabled={isLoading || !stripe || !elements} id="submit" type="submit">
          <span id="button-text">{isLoading ? <div className="spinner" id="spinner"></div> : 'Pay now'}</span>
        </Button>
        {/* Show any error or success messages */}
        {message && <div id="payment-message">{message}</div>}
      </Stack>
    </form>
  );
}
