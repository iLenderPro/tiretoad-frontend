'use client';
import { Alert, Avatar, Card, CardMedia, List, ListItem, ListItemAvatar, ListItemText, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import { TireDamage } from '@/features/ui/ServiceRequestWizard/types/TireDamage';
import { TireType } from '@/features/ui/ServiceRequestWizard/types/TireType';
import Box from '@mui/material/Box';
import { ServiceRequestDto } from '@/entities/serviceRequest/api/dto/ServiceRequestDto';
import { UserRole } from '@/entities/user/api/dto/UserRole';
import { ClientDto } from '@/entities/user/api/dto/ClientDto';
import { VendorResponseStatus } from '@/entities/vendorResponse/api/dto/VendorResponseStatus';
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';

export type ServiceRequestPreviewProps = {
  serviceRequest: ServiceRequestDto;
  user: ClientDto;
};
export default function ServiceRequestPreview(props: ServiceRequestPreviewProps) {
  const router = useRouter();
  const { user, serviceRequest } = props;

  return (
    <>
      {serviceRequest && (
        <>
          {user.role === UserRole.CLIENT && (
            <Stack alignItems="center" gap={2}>
              <Typography gutterBottom>We are reaching out to mobile repair shops to get you back on the road</Typography>
              <Typography gutterBottom variant="h6">
                Who already responded:
              </Typography>
              <Alert severity="warning">Please, wait on this page until someone responds.</Alert>
              <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                {!!serviceRequest.responses?.filter((response) => response.status === VendorResponseStatus.ACCEPTED)?.length &&
                  serviceRequest.responses?.map((response) => (
                    <ListItem
                      key={response.id}
                      alignItems="flex-start"
                      secondaryAction={
                        <Button color="success" variant="contained" onClick={() => router.push(`/responses/${response.id}/chat`)}>
                          Chat
                        </Button>
                      }
                    >
                      <ListItemAvatar>
                        <Avatar src="/icons/icon_tiretoad.png" />
                      </ListItemAvatar>
                      <ListItemText
                        primary={response.vendor.businessName}
                        secondary={
                          <>
                            <Typography sx={{ display: 'inline' }} component="span" variant="body2" color="text.primary">
                              {response.vendor.fullName}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                  ))}
              </List>
            </Stack>
          )}
          <Stack>
            <Stack>Name: {serviceRequest.client.fullName}</Stack>
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
                <CardMedia width={1} component="img" image={`https://tiretoad-data-bucket.s3.amazonaws.com/${serviceRequest.client.id}/${serviceRequest.tires[0].imageOfDamage}`} />
              </Card>
            </Box>
            <Box flex={1}>
              <Card>
                <CardMedia
                  width={1}
                  component="img"
                  image={`https://tiretoad-data-bucket.s3.amazonaws.com/${serviceRequest.client.id}/${serviceRequest.tires[0].imageOfTireWall}`}
                />
              </Card>
            </Box>
          </Stack>
        </>
      )}
    </>
  );
}
