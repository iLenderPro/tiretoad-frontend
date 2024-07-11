import { Container, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import SignUpForm from '@/features/ui/vendor/SignUpForm/SignUpForm';

export default function SignUpPage({ searchParams }: { searchParams?: { redirect_url?: string } }) {
  return (
    <Container style={{ display: 'flex', flex: 1, alignItems: 'center' }}>
      <Stack flex="1" alignItems="center" gap={5}>
        <Typography variant="h3">Please, sign up</Typography>
        <SignUpForm redirectUrl={searchParams?.redirect_url} />
      </Stack>
    </Container>
  );
}
