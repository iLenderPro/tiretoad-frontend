import { Avatar, Button, List, ListItem, ListItemAvatar, ListItemText, Radio, Stack, TextField } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/navigation';
import { useGetServiceRequestQuery } from '@/entities/serviceRequest/api/serviceRequestApi';
import IconButton from '@mui/material/IconButton';
import { StyledPaper } from '@/features/ui/Paper/Paper';
import { useFieldArray, useForm } from 'react-hook-form';
import { ServiceRequestDto } from '@/entities/serviceRequest/api/dto/ServiceRequestDto';

export default function RespondedVendorsList(props: { serviceRequestId: string }) {
  const { serviceRequestId } = props;
  const { data: serviceRequest, isFetching } = useGetServiceRequestQuery(serviceRequestId, {
    pollingInterval: 5000,
  });
  const router = useRouter();

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<Pick<ServiceRequestDto, 'responses'>>({
    values: serviceRequest,
  });

  const { fields } = useFieldArray({ control, name: 'responses', keyName: 'key' });

  return (
    <Stack alignItems="center" gap={2} width="100%">
      {!!fields?.length && (
        <StyledPaper>
          <List sx={{ width: '100%' }}>
            {fields?.map((field, index) => (
              <Stack key={field.key}>
                <ListItem
                  secondaryAction={
                    <Stack direction="row" alignItems="center">
                      <Button color="primary" variant="contained" size="small" onClick={() => router.push(`/responses/${field.id}/chat`)}>
                        Chat
                      </Button>
                      <IconButton disableRipple>
                        <Radio />
                      </IconButton>
                    </Stack>
                  }
                >
                  <ListItemAvatar>
                    <Avatar src="/icons/icon_tiretoad.png" />
                  </ListItemAvatar>
                  <ListItemText
                    primary={field.vendor.businessName}
                    secondary={
                      <Typography sx={{ display: 'inline' }} component="span" variant="body2" color="text.primary">
                        {field.vendor.fullName}
                      </Typography>
                    }
                  />
                </ListItem>
                <Stack gap={2} marginX={2}>
                  <Stack direction="row" gap={2}>
                    <Button variant="outlined" color="info">
                      +25%
                    </Button>
                    <Button variant="outlined" color="info">
                      +50%
                    </Button>
                    <Button variant="outlined" color="info">
                      +75%
                    </Button>
                    <Button variant="outlined" color="info">
                      +100%
                    </Button>
                  </Stack>
                  <Stack direction="row" gap={2}>
                    <TextField {...register(`responses.${index}.price`, { required: { value: true, message: 'Price is required' } })} size="small" />
                    <Button variant="contained" size="small">
                      Send price
                    </Button>
                  </Stack>
                </Stack>
              </Stack>
            ))}
          </List>
        </StyledPaper>
      )}
    </Stack>
  );
}
