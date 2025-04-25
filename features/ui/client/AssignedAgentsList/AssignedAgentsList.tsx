import { Alert, Avatar, List, ListItem, ListItemAvatar, ListItemText, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';
import { useGetServiceRequestQuery } from '@/entities/serviceRequest/api/serviceRequestApi';

export default function AssignedAgentsList(props: { serviceRequestId: string }) {
  const { serviceRequestId } = props;
  const { data: serviceRequest, isFetching } = useGetServiceRequestQuery(serviceRequestId, {
    pollingInterval: 1000,
  });
  const router = useRouter();
  const agent = serviceRequest?.agent;

  return (
    <Stack alignItems="center" gap={2} width="100%" maxWidth={566}>
      {!agent && (
        <>
          <Alert severity="info">Please, wait on this page until agent connects.</Alert>
        </>
      )}
      {agent && (
        <>
          <Typography gutterBottom variant="h6">
            Assigned Agents:
          </Typography>
          <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            <ListItem
              key={agent.id}
              alignItems="flex-start"
              secondaryAction={
                <Button color="primary" variant="contained" onClick={() => router.push(`/agents/${agent.id}/chat`)}>
                  Contact
                </Button>
              }
            >
              <ListItemAvatar>
                <Avatar src="/icons/icon_tiretoad.png" />
              </ListItemAvatar>
              <ListItemText
                primary={'Towing Agent'}
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
        </>
      )}
    </Stack>
  );
}
