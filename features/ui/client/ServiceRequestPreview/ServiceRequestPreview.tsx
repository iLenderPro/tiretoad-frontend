'use client';
import { Card, CardActionArea, CardMedia, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import { TireDamage } from '@/features/ui/ServiceRequestWizard/types/TireDamage';
import { TireType } from '@/features/ui/ServiceRequestWizard/types/TireType';
import Box from '@mui/material/Box';
import { ServiceRequestDto } from '@/entities/serviceRequest/api/dto/ServiceRequestDto';
import { ClientDto } from '@/entities/user/api/dto/ClientDto';
import { TireSide } from '@/features/ui/ServiceRequestWizard/types/TireSide';

export type ServiceRequestPreviewProps = {
  serviceRequest: ServiceRequestDto;
  user: ClientDto;
};
export default function ServiceRequestPreview(props: ServiceRequestPreviewProps) {
  const { user, serviceRequest } = props;

  return (
    <>
      {serviceRequest && (
        <>
          <Stack>
            <Stack>Name: {serviceRequest.client.fullName}</Stack>
            <Stack>
              Vehicle: {serviceRequest.vehicle.year} {serviceRequest.vehicle.model} {serviceRequest.vehicle.trim}
            </Stack>
            <Stack>Tire Side: {TireSide[serviceRequest.tires[0].side as keyof typeof TireSide]}</Stack>
            <Stack>Tire Size: {serviceRequest.tires[0].size}</Stack>
            <Stack>Tire Type: {TireType[serviceRequest.tires[0].type as keyof typeof TireType]}</Stack>
            <Stack>Damage: {TireDamage[serviceRequest.tires[0].damage as keyof typeof TireDamage]}</Stack>
            <Stack>
              Location: {serviceRequest.location.address} {serviceRequest.location.comment ? `(${serviceRequest.location.comment})` : ''}
            </Stack>
          </Stack>
          <Typography>Images of damage and tire wall</Typography>
          <Stack direction="row" maxWidth="566px" gap={3} flexWrap="nowrap" alignItems="center">
            <Box flex={1}>
              <Card>
                <CardActionArea
                  onClick={() => window.open(`https://tiretoad-data-bucket.s3.amazonaws.com/${serviceRequest.client.id}/${serviceRequest.tires[0].imageOfDamage}`, '_blank')}
                >
                  <CardMedia
                    width={1}
                    component="img"
                    image={`https://tiretoad-data-bucket.s3.amazonaws.com/${serviceRequest.client.id}/${serviceRequest.tires[0].imageOfDamage}`}
                  />
                </CardActionArea>
              </Card>
            </Box>
            <Box flex={1}>
              <Card>
                <CardActionArea
                  onClick={() => window.open(`https://tiretoad-data-bucket.s3.amazonaws.com/${serviceRequest.client.id}/${serviceRequest.tires[0].imageOfTireWall}`, '_blank')}
                >
                  <CardMedia
                    width={1}
                    component="img"
                    image={`https://tiretoad-data-bucket.s3.amazonaws.com/${serviceRequest.client.id}/${serviceRequest.tires[0].imageOfTireWall}`}
                  />
                </CardActionArea>
              </Card>
            </Box>
          </Stack>
        </>
      )}
    </>
  );
}
