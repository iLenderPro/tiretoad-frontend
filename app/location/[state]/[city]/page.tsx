import { Container, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';

export default async function LocationCity(props: any) {
  const { params } = props;
  const { state, city, count } = await getCount({ params });
  return (
    <>
      <main style={{ height: '100%' }}>
        <Container style={{ height: '100%', paddingTop: '16px' }}>
          <Stack alignItems="center" gap={5}>
            <Typography variant="h4">
              There are {count} mobile tire repair shops in {city.name} ({state.name})
            </Typography>
          </Stack>
        </Container>
      </main>
    </>
  );
}

export async function getCount({ params }: { params: { state: string; city: string } }) {
  const searchParams = new URLSearchParams({
    city: params.city,
  });
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/vendors/count/${params.state}/?${searchParams}`);
  return await response.json();
}
