'use client';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from './PaymentForm';
import { Appearance, loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { useCreateIntentMutation } from '@/entities/payment/api/paymentApi';
import { ServiceRequestDto } from '@/entities/serviceRequest/api/dto/ServiceRequestDto';
import { PaymentIntent } from '@/entities/payment/api/dto/PaymentIntent';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

export type CheckoutFormProps = { serviceRequest: ServiceRequestDto };
export default function CheckoutForm(props: CheckoutFormProps) {
  const { serviceRequest } = props;
  const appearance: Appearance = {
    theme: 'stripe',
    variables: {
      colorPrimary: '#c02535',
    },
  };
  const [paymentIntent, setPaymentIntent] = useState<PaymentIntent>();
  const [create, { isLoading }] = useCreateIntentMutation();
  console.log('paymentIntent', paymentIntent);
  useEffect(() => {
    create({ serviceRequestId: serviceRequest.id! })
      .unwrap()
      .then((intent) => {
        setPaymentIntent((prevState) => (prevState ? prevState : intent));
      });
  }, []);

  return paymentIntent ? (
    <Elements stripe={stripePromise} options={{ appearance, clientSecret: paymentIntent.client_secret }}>
      <PaymentForm isLoading={isLoading} serviceRequestId={serviceRequest.id!} paymentIntentId={paymentIntent.id} />
    </Elements>
  ) : (
    <></>
  );
}
