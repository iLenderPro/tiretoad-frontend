import { Alert, Avatar, List, ListItem, ListItemAvatar, ListItemText, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useGetServiceRequestQuery } from '@/entities/serviceRequest/api/serviceRequestApi';
import { useState } from 'react';
import QuoteDialog from '@/features/ui/vendor/QuoteDialog/QuoteDialog';
import { StyledPaper } from '../../Paper/Paper';
import { useGetVendorResponseQuery } from '@/entities/vendorResponse/api/vendorResponseApi';

export default function AssignedAgentsVendor(props: { serviceRequestId: string; vendorResponseId: string }) {
  const { serviceRequestId, vendorResponseId } = props;
  const { data: serviceRequest } = useGetServiceRequestQuery(serviceRequestId, {
    pollingInterval: 1000,
  });
  const { data: vendorResponse } = useGetVendorResponseQuery(vendorResponseId);

  const agent = serviceRequest?.agent;
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Stack alignItems="center" gap={2} width="100%">
      {!agent && <Alert severity="info">Please, wait on this page until agent connects.</Alert>}
      {agent && (
        <StyledPaper>
          <List sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%', padding: 2 }}>
            <ListItem
              disablePadding
              disableGutters
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
              {vendorResponse && <QuoteDialog vendorResponse={vendorResponse} open={open} handleClose={handleClose} />}
            </ListItem>
          </List>
        </StyledPaper>
      )}
    </Stack>
  );
}
