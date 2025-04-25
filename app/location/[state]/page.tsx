import { Container, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import ServiceRequestWizard from '@/features/ui/client/ServiceRequestWizard/ServiceRequestWizard';
import type { Metadata } from 'next';

type Props = {
  params: { state: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function LocationState(props: any) {
  const { params } = props;
  const { state, count } = await getCount({ params });
  return (
    <Container style={{ display: 'flex', flex: 1, paddingTop: '24px' }}>
      <Stack flex="1" alignItems="center" gap={5}>
        <Typography variant="h1">
          There are {count} mobile tire repair shops in {state.name}
        </Typography>
        <ServiceRequestWizard />
      </Stack>
    </Container>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state, count } = await getCount({ params });

  return {
    title: `There are ${count} mobile tire repair shops in ${state.name}`,
    description: `Get your flat tire fixed in ${state.name} in 30 minutes or less. Connect with a mobile tire repair service right in your area instantly.`,
  };
}

export async function generateStaticParams() {
  const locations = await getLocations();
  console.log('locations', locations);
  return locations.map((state: { code: string; name: string }) => ({ code: state.code }));
}

async function getLocations() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/geo/locations`);
  return await response.json();
}

async function getCount({ params }: { params: { state: string } }) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/vendors/count/${params.state}/`, { cache: 'force-cache' });
  return await response.json();
}
