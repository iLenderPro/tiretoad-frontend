import { Avatar, Button, List, ListItem, ListItemAvatar, ListItemText, Radio, RadioGroup, Stack, TextField } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/navigation';
import { useGetServiceRequestQuery } from '@/entities/serviceRequest/api/serviceRequestApi';
import { StyledPaper } from '@/features/ui/Paper/Paper';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { ServiceRequestDto } from '@/entities/serviceRequest/api/dto/ServiceRequestDto';
import React from 'react';

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
            {fields?.map((response, index) => (
              <Stack key={response.key}>
                <ListItem
                  secondaryAction={
                    <Stack direction="row" alignItems="center">
                      <Button color="primary" variant="contained" size="small" onClick={() => router.push(`/responses/${response.id}/chat`)}>
                        Chat
                      </Button>
                      <Controller
                        control={control}
                        name={`responses.${index}.id`}
                        render={({ field }) => (
                          <RadioGroup row {...field}>
                            <Radio value={response.id} />
                          </RadioGroup>
                        )}
                      />
                    </Stack>
                  }
                >
                  <ListItemAvatar>
                    <Avatar src="/icons/icon_tiretoad.png" />
                  </ListItemAvatar>
                  <ListItemText
                    primary={response.vendor.businessName}
                    secondary={
                      <Typography sx={{ display: 'inline' }} component="span" variant="body2" color="text.primary">
                        {response.vendor.fullName}
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
                    <Button variant="contained" size="small" disabled={true}>
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
