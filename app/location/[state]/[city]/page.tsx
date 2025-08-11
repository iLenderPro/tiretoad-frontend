import { Container, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import type { Metadata, ResolvingMetadata } from 'next';
import { LandingPageForm } from '@/features/ui/landing/LandingPageForm/LandingPageForm';
import React from 'react';
import Image from 'next/image';

type Props = {
  params: { state: string; city: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function LocationCity(props: any) {
  const { params } = props;
  const { state, city, count } = await getCount({ params });
  return (
    <>
      <Container style={{ display: 'flex', flex: 1, paddingTop: '24px' }}>
        <Stack sx={{ textAlign: 'center', paddingTop: '160px' }} flexGrow={1} gap={2} justifyContent="space-between" minHeight="100%" paddingBottom={3}>
          <Typography variant="h1">
            There are {count} towing services in {city.name}, {state.code}
          </Typography>
          <LandingPageForm />
        </Stack>
      </Container>
      <Stack alignItems="center" gap={5} padding={5} style={{ backgroundColor: '#000' }}>
        <Stack direction="row" gap={3}>
          <Image src="/icons/icon-facebook.svg" width={24} height={24} alt="Facebook" />
          <Image src="/icons/icon-twitter.svg" width={24} height={24} alt="Twitter" />
          <Image src="/icons/icon-linkedin.svg" width={24} height={24} alt="LinkedIn" />
        </Stack>
        <Stack direction="row" gap={2}>
          <Typography variant="body2" color="error.contrastText">
            Towing Service
          </Typography>
          <Typography variant="body2" color="error.contrastText">
            |
          </Typography>
          <Typography variant="body2" color="error.contrastText">
            About
          </Typography>
          <Typography variant="body2" color="error.contrastText">
            |
          </Typography>
          <Typography variant="body2" color="error.contrastText">
            Contact
          </Typography>
        </Stack>
      </Stack>
    </>
  );
}

export async function generateMetadata({ params, searchParams }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const { state, city, count } = await getCount({ params });

  return {
    title: `There are ${count} towing services in ${city.name}, (${state.code})`,
    description: `TireToad offers guaranteed towing service in ${city.name}, ${state.code} with 30-minute response times. Fast, reliable, and here when you need us most!`,
  };
}

async function getCount({ params }: { params: { state: string; city: string } }) {
  const searchParams = new URLSearchParams({
    city: params.city,
  });
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/vendors/count/${params.state}/?${searchParams}`, { cache: 'force-cache' });
  return await response.json();
}
