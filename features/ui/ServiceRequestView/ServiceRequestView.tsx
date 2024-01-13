'use client';
import { Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useGetServiceRequestQuery } from '@/entities/serviceRequest/api/serviceRequestApi';

export default function ServiceRequestView(props: { id: string }) {
  const { id } = props;
  const { data, isFetching } = useGetServiceRequestQuery(id);
  return (
    <Stack alignItems="center" minHeight="100%" gap={3}>
      <Typography variant="h4">Service Request Page</Typography>
      {!isFetching && data && data.location.address}
    </Stack>
  );
}
