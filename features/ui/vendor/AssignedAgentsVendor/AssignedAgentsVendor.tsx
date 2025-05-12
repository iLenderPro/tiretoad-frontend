import { Alert, Avatar, List, ListItem, ListItemAvatar, ListItemText, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';
import { useGetServiceRequestQuery } from '@/entities/serviceRequest/api/serviceRequestApi';
import { useState } from 'react';
import QuoteDialog from '@/features/ui/vendor/QuoteDialog/QuoteDialog';

export default function AssignedAgentsVendor(props: { serviceRequestId: string }) {
  const { serviceRequestId } = props;
  const { data: serviceRequest, isFetching } = useGetServiceRequestQuery(serviceRequestId, {
    pollingInterval: 1000,
  });
  const router = useRouter();
  const agent = serviceRequest?.agent;
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Stack alignItems="center" gap={2} width="100%" maxWidth={566}>
      {!agent && <Alert severity="info">Please, wait on this page until agent connects.</Alert>}
      {agent && (
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
          <ListItem
            key={agent.id}
            alignItems="flex-start"
            secondaryAction={
              <Button color="primary" variant="contained" onClick={() => handleClickOpen()}>
                Quote
              </Button>
            }
          >
            <ListItemAvatar>
              <Avatar src="/icons/icon_tiretoad.png" />
            </ListItemAvatar>
            <ListItemText
              primary={<Typography fontWeight="500">Towing Agent</Typography>}
              secondary={
                <>
                  <Typography sx={{ display: 'inline' }} component="span" variant="body2" color="text.primary">
                    {agent.fullName}
                  </Typography>
                </>
              }
            />
            <QuoteDialog open={open} handleClose={handleClose} />
          </ListItem>
        </List>
      )}
    </Stack>
  );
}
