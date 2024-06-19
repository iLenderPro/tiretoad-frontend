import { Container, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import UserLoginForm from '@/shared/ui/UserLoginForm/UserLoginForm';

export default function LoginPage({ searchParams }: { searchParams: { redirect_url: string } }) {
  return (
    <Container style={{ display: 'flex', flex: 1, alignItems: 'center' }}>
      <Stack flex="1" alignItems="center" gap={5}>
        <Typography variant="h4">Please, login</Typography>
        <UserLoginForm redirectUrl={searchParams.redirect_url} />
      </Stack>
    </Container>
  );
}
