import { Container, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import ServiceRequestWizard from '@/features/ui/ServiceRequestWizard/ServiceRequestWizard';

export default async function LocationState(props: any) {
  const { params } = props;
  const { state, count } = await getCount({ params });
  return (
    <Container style={{ display: 'flex', flex: 1, paddingTop: '24px' }}>
      <Stack flex="1" alignItems="center" gap={5}>
        <Typography variant="h4">
          There are {count} mobile tire repair shops in {state.name}
        </Typography>
        <ServiceRequestWizard />
      </Stack>
    </Container>
  );
}

async function getCount({ params }: { params: { state: string } }) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/vendors/count/${params.state}/`);
  return await response.json();
}
