'use client';
import { Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useGetServiceRequestQuery } from '@/entities/serviceRequest/api/serviceRequestApi';

export default function ServiceRequestOverview(props: { id: string }) {
  const { id } = props;
  const { data: serviceRequest, isFetching } = useGetServiceRequestQuery(id);

  return (
    <Stack alignItems="center" minHeight="100%" gap={3}>
      <Typography variant="h4">Message Sent!</Typography>
      {!isFetching && serviceRequest && (
        <Stack>
          <Stack>Name: {serviceRequest.user.fullName}</Stack>
          <Stack>
            Vehicle: {serviceRequest.vehicle.year} {serviceRequest.vehicle.model} {serviceRequest.vehicle.trim}
          </Stack>
          <Stack>Damage: {serviceRequest.tires[0].damage}</Stack>
          <Stack>Tire Size: {serviceRequest.tires[0].size}</Stack>
          <Stack>Tire Type: {serviceRequest.tires[0].type}</Stack>
          <Stack>Location: {serviceRequest.location.address}</Stack>
          <Stack>
            Picture of damage:{' '}
            <img
              src={`https://tiretoad-data-bucket.s3.amazonaws.com/${serviceRequest.user.id}/${serviceRequest.tires[0].imageOfDamage}`}
              alt="image of damage"
              width={100}
              height={100}
            />
          </Stack>
          <Stack>
            Picture of tire size:{' '}
            <img src={`https://tiretoad-data-bucket.s3.amazonaws.com/${serviceRequest.user.id}/${serviceRequest.tires[0].imageOfTireWall}`} alt="image of tire size" />
          </Stack>
        </Stack>
      )}
    </Stack>
  );
}
