import { Container, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import SignUpForm from '@/features/ui/vendor/SignUpForm/SignUpForm';
import Image from 'next/image';
import Box from '@mui/material/Box';

export default function SignUpPage({ searchParams }: { searchParams?: { redirect_url?: string } }) {
  return (
    <Container style={{ display: 'flex', flex: 1, alignItems: 'center' }}>
      <Stack flex="1" alignItems="center" gap={5} marginTop={3}>
        <Box position="relative" width="100%" height="100px">
          <Image src="/images/tiretoad_logo_min.png" alt="TireToad - Mobile Tire Repair Shops" fill={true} objectFit="contain" />
        </Box>
        <Typography variant="h3">Please, sign up</Typography>
        <SignUpForm redirectUrl={searchParams?.redirect_url} />
      </Stack>
    </Container>
  );
}
