import { Container, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import { UserRole } from '@/entities/user/api/dto/UserRole';
import UserLoginForm from '@/shared/ui/UserLoginForm/UserLoginForm';

export default function AgentLoginPage({ searchParams }: { searchParams: { redirect_url: string } }) {
  return (
    <Container style={{ display: 'flex', flex: 1, alignItems: 'center' }}>
      <Stack flex="1" alignItems="center" gap={5}>
        <Typography variant="h3">Please, login</Typography>
        <UserLoginForm role={UserRole.VENDOR} redirectUrl={searchParams.redirect_url} />
      </Stack>
    </Container>
  );
}
