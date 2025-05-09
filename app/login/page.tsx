import { Container, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import UserLoginForm from '@/shared/ui/UserLoginForm/UserLoginForm';
import { UserRole } from '@/entities/user/api/dto/UserRole';

export default function LoginPage({ searchParams }: { searchParams: { redirect_url: string } }) {
  return (
    <Container style={{ display: 'flex', flex: 1, alignItems: 'center' }}>
      <Stack flex="1" alignItems="center" gap={5}>
        <Typography variant="h3">Please, login</Typography>
        <UserLoginForm role={UserRole.CLIENT} redirectUrl={searchParams.redirect_url} />
      </Stack>
    </Container>
  );
}
