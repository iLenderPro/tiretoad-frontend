'use client';
import { Card, CardMedia, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useGetServiceRequestQuery } from '@/entities/serviceRequest/api/serviceRequestApi';
import { TireDamage } from '@/features/ui/ServiceRequestWizard/types/TireDamage';
import { TireType } from '@/features/ui/ServiceRequestWizard/types/TireType';
import Box from '@mui/material/Box';
import React from 'react';

export default function ServiceRequestOverview(props: { id: string }) {
  const { id } = props;
  const { data: serviceRequest, isFetching } = useGetServiceRequestQuery(id);

  return (
    <Stack alignItems="center" minHeight="100%" gap={3}>
      {!isFetching && serviceRequest && (
        <>
          <Typography variant="h4">Message Sent!</Typography>
          <Typography>We are reaching out to mobile repair shops to get you back on the road</Typography>
          <Stack>
            <Stack>Name: {serviceRequest.user.fullName}</Stack>
            <Stack>
              Vehicle: {serviceRequest.vehicle.year} {serviceRequest.vehicle.model} {serviceRequest.vehicle.trim}
            </Stack>
            <Stack>Damage: {TireDamage[serviceRequest.tires[0].damage as keyof typeof TireDamage]}</Stack>
            <Stack>Tire Size: {serviceRequest.tires[0].size}</Stack>
            <Stack>Tire Type: {TireType[serviceRequest.tires[0].type as keyof typeof TireType]}</Stack>
            <Stack>
              Location: {serviceRequest.location.address} {serviceRequest.location.comment ? `(${serviceRequest.location.comment})` : ''}
            </Stack>
          </Stack>
          <Typography>Images of your damage and tire wall</Typography>
          <Stack direction="row" maxWidth="566px" gap={3} flexWrap="nowrap" alignItems="center">
            <Box flex={1}>
              <Card>
                <CardMedia component="img" width={1} image={`https://tiretoad-data-bucket.s3.amazonaws.com/tmp/${serviceRequest.tires[0].imageOfDamage}`} />
              </Card>
            </Box>
            <Box flex={1}>
              <Card>
                <CardMedia width={1} component="img" image={`https://tiretoad-data-bucket.s3.amazonaws.com/tmp/${serviceRequest.tires[0].imageOfTireWall}`} />
              </Card>
            </Box>
          </Stack>
        </>
      )}
    </Stack>
  );
}
