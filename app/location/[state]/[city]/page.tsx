import { Container, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import ServiceRequestWizard from '@/features/ui/client/ServiceRequestWizard/ServiceRequestWizard';
import type { Metadata, ResolvingMetadata } from 'next';

type Props = {
  params: { state: string; city: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function LocationCity(props: any) {
  const { params } = props;
  const { state, city, count } = await getCount({ params });
  return (
    <Container style={{ display: 'flex', flex: 1, paddingTop: '24px' }}>
      <Stack flex="1" alignItems="center" gap={5}>
        <Typography variant="h1">
          There are {count} mobile tire repair shops in {city.name}, {state.code}
        </Typography>
        <ServiceRequestWizard />
      </Stack>
    </Container>
  );
}

export async function generateMetadata({ params, searchParams }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const { state, city, count } = await getCount({ params });

  return {
    title: `There are ${count} mobile tire repair shops in ${city.name} (${state.code})`,
    description: `Get your flat tire fixed in ${city.name}, ${state.code} in 30 minutes or less. Connect with a mobile tire repair service right in your area instantly.`,
  };
}

async function getCount({ params }: { params: { state: string; city: string } }) {
  const searchParams = new URLSearchParams({
    city: params.city,
  });
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/vendors/count/${params.state}/?${searchParams}`, { cache: 'force-cache' });
  return await response.json();
}
