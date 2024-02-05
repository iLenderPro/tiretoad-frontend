'use client';
import { Card, CardMedia, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import { TireDamage } from '@/features/ui/ServiceRequestWizard/types/TireDamage';
import { TireType } from '@/features/ui/ServiceRequestWizard/types/TireType';
import Box from '@mui/material/Box';
import { ServiceRequestDto } from '@/entities/serviceRequest/api/dto/ServiceRequestDto';
import Link from 'next/link';
import { UserRole } from '@/entities/user/api/dto/UserRole';
import { UserDto } from '@/entities/user/api/dto/UserDto';
import { VendorResponseStatus } from '@/entities/vendorResponse/api/dto/VendorResponseStatus';

export type ServiceRequestPreviewProps = {
  serviceRequest: ServiceRequestDto;
  user: UserDto;
};
export default function ServiceRequestPreview(props: ServiceRequestPreviewProps) {
  const { user, serviceRequest } = props;

  return (
    <>
      {serviceRequest && (
        <>
          {user.role === UserRole.CLIENT && (
            <Stack>
              <Typography>We are reaching out to mobile repair shops to get you back on the road</Typography>
              <Typography gutterBottom>Already responded:</Typography>
              {!!serviceRequest.responses?.filter((response) => response.status === VendorResponseStatus.ACCEPTED)?.length && (
                <Box>{serviceRequest.responses?.map((response) => <Link href={`/responses/${response.id}/chat`}>{response.vendor.fullName}</Link>)}</Box>
              )}
            </Stack>
          )}
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
          <Typography>Images of damage and tire wall</Typography>
          <Stack direction="row" maxWidth="566px" gap={3} flexWrap="nowrap" alignItems="center">
            <Box flex={1}>
              <Card>
                <CardMedia width={1} component="img" image={`https://tiretoad-data-bucket.s3.amazonaws.com/${serviceRequest.user.id}/${serviceRequest.tires[0].imageOfDamage}`} />
              </Card>
            </Box>
            <Box flex={1}>
              <Card>
                <CardMedia width={1} component="img" image={`https://tiretoad-data-bucket.s3.amazonaws.com/${serviceRequest.user.id}/${serviceRequest.tires[0].imageOfTireWall}`} />
              </Card>
            </Box>
          </Stack>
        </>
      )}
    </>
  );
}
