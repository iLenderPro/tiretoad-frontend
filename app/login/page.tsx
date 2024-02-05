import { Container, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import UserLoginForm from '@/shared/ui/UserLoginForm/UserLoginForm';

export default function LoginPage({ searchParams }: { searchParams?: { redirect_url?: string } }) {
  return (
    <main style={{ height: '100%' }}>
      <Container style={{ height: '100%', paddingTop: '16px' }}>
        <Stack alignItems="center" gap={5}>
          <Typography variant="h4">Please, login</Typography>
          <UserLoginForm redirectUrl={searchParams?.redirect_url} />
        </Stack>
      </Container>
    </main>
  );
}
