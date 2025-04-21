'use client';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from './PaymentForm';
import { Appearance, loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { useCreateIntentMutation } from '@/entities/payment/api/paymentApi';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

export default function CheckoutForm() {
  const appearance: Appearance = {
    theme: 'stripe',
    variables: {
      colorPrimary: '#c02535',
    },
  };
  const [clientSecret, setClientSecret] = useState<string>();
  const [create, { isLoading }] = useCreateIntentMutation();

  useEffect(() => {
    create({ amount: 10000 })
      .unwrap()
      .then((intent) => setClientSecret(intent.clientSecret));
  }, []);

  return clientSecret ? (
    <Elements stripe={stripePromise} options={{ appearance, clientSecret }}>
      <PaymentForm isLoading={isLoading} />
    </Elements>
  ) : (
    <></>
  );
}
