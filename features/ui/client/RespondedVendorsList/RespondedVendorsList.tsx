import { Alert, Avatar, List, ListItem, ListItemAvatar, ListItemText, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';
import { VendorResponseStatus } from '@/entities/vendorResponse/api/dto/VendorResponseStatus';
import { useGetServiceRequestQuery } from '@/entities/serviceRequest/api/serviceRequestApi';

export default function RespondedVendorsList(props: { serviceRequestId: string }) {
  const { serviceRequestId } = props;
  const { data: serviceRequest, isFetching } = useGetServiceRequestQuery(serviceRequestId, {
    pollingInterval: 1000,
  });
  const router = useRouter();
  const accepted = serviceRequest?.responses?.filter((response) => response.status === VendorResponseStatus.ACCEPTED);
  return (
    <Stack alignItems="center" gap={2} width="100%" maxWidth={566}>
      {!accepted?.length && (
        <>
          <Typography gutterBottom>We are reaching out to mobile repair shops to get you back on the road</Typography>
          <Alert severity="warning">Please, wait on this page until someone responds.</Alert>
        </>
      )}
      {!!accepted?.length && (
        <>
          <Typography gutterBottom variant="h6">
            Who already responded:
          </Typography>
          <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {accepted?.map((response) => (
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
        </>
      )}
    </Stack>
  );
}
