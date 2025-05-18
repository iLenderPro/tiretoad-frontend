import { Alert, Avatar, List, ListItem, ListItemAvatar, ListItemText, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';
import { useGetServiceRequestQuery } from '@/entities/serviceRequest/api/serviceRequestApi';
import { StyledPaper } from '@/features/ui/Paper/Paper';

export default function AssignedAgentsList(props: { serviceRequestId: string; type?: 'PAY' | 'CHAT' }) {
  const { serviceRequestId, type = 'CHAT' } = props;
  const { data: serviceRequest, isFetching } = useGetServiceRequestQuery(serviceRequestId, {
    pollingInterval: 1000,
  });
  const router = useRouter();
  const agent = serviceRequest?.agent;

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
                type === 'CHAT' ? (
                  <Button color="primary" variant="contained" onClick={() => router.push(`/requests/${serviceRequestId}/chat`)}>
                    Chat
                  </Button>
                ) : (
                  <Button color="primary" variant="contained" onClick={() => router.push(`/requests/${serviceRequestId}/pay`)}>
                    Pay Now
                  </Button>
                )
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
            </ListItem>
          </List>
        </StyledPaper>
      )}
    </Stack>
  );
}
