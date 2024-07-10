import { Container, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import ServiceRequestWizard from '@/features/ui/ServiceRequestWizard/ServiceRequestWizard';

export default async function LocationCity(props: any) {
  const { params } = props;
  const { state, city, count } = await getCount({ params });
  return (
    <Container style={{ display: 'flex', flex: 1, paddingTop: '24px' }}>
      <Stack flex="1" alignItems="center" gap={5}>
        <Typography variant="h4">
          There are {count} mobile tire repair shops in {city.name} ({state.name})
        </Typography>
        <ServiceRequestWizard />
      </Stack>
    </Container>
  );
}

async function getCount({ params }: { params: { state: string; city: string } }) {
  const searchParams = new URLSearchParams({
    city: params.city,
  });
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/vendors/count/${params.state}/?${searchParams}`);
  return await response.json();
}
