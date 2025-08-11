import { Container, Stack } from '@mui/material';
import type { Metadata } from 'next';
import { LandingPageForm } from '@/features/ui/landing/LandingPageForm/LandingPageForm';
import React from 'react';
import Typography from '@mui/material/Typography';
import Image from 'next/image';

export const metadata: Metadata = {
  title: `TireToad guarantees fast, reliable towing service with 30-minute response time.`,
  description: `TireToad’s 24/7 tow truck dispatch app offers fast, reliable help for any roadside emergency. DIY dispatch makes getting assistance easy!`,
};
export default function Home() {
  return (
    <>
      <Container
        style={{
          display: 'flex',
          flex: 1,
          paddingTop: '24px',
          backgroundImage: 'url(/images/background-home.png)',
          backgroundSize: 'contain',
          backgroundPosition: 'top',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <Stack sx={{ textAlign: 'center', paddingTop: '160px' }} flexGrow={1} gap={2} justifyContent="space-between" minHeight="100%" paddingBottom={3}>
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
