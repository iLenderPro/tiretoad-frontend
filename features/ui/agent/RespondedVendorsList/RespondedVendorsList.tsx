import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Badge,
  Button,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Radio,
  RadioGroup,
  Stack,
  TextField,
} from '@mui/material';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/navigation';
import { useGetServiceRequestQuery } from '@/entities/serviceRequest/api/serviceRequestApi';
import { StyledPaper } from '@/features/ui/Paper/Paper';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { ServiceRequestDto } from '@/entities/serviceRequest/api/dto/ServiceRequestDto';
import { SyntheticEvent, useState } from 'react';
import { useSelectForJobMutation, useSubmitPriceMutation } from '@/entities/vendorResponse/api/vendorResponseApi';
import { VendorResponseStatus } from '@/entities/vendorResponse/api/dto/VendorResponseStatus';
import { VendorResponseStatusColorMap } from '@/features/ui/vendor/ServiceRequestTableVendor/VendorResponseStatus';

export default function RespondedVendorsList(props: { serviceRequestId: string }) {
  const { serviceRequestId } = props;
  const { data: serviceRequest, isFetching } = useGetServiceRequestQuery(serviceRequestId);
  const [selectVendor] = useSelectForJobMutation();
  const [submitPrice] = useSubmitPriceMutation();
  const [expanded, setExpanded] = useState<string | boolean>(serviceRequest?.responses?.find((response) => response.selected)?.id || false);
  const router = useRouter();
  const handleChange = (id: string) => (event: SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? id : false);
  };
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Pick<ServiceRequestDto, 'responses'>>({
    values: { ...serviceRequest, responses: serviceRequest?.responses?.map((response) => ({ ...response, price: response.price || response.quote || 0 })) },
  });
  const { fields, update } = useFieldArray({ control, name: 'responses', keyName: 'key' });

  const onSubmit = async (value: Pick<ServiceRequestDto, 'responses'>) => {
    const vendorResponse = value?.responses?.find((response) => response.selected);
    if (!vendorResponse) return;

    const result = await submitPrice({ id: vendorResponse.id, price: vendorResponse.price, markup: vendorResponse.markup, status: VendorResponseStatus.PENDING }).unwrap();
  };

  const onVendorChange = async (value: string | undefined) => {
    const result = await selectVendor({ id: value, selected: true }).unwrap();
  };

  return (
    <Stack alignItems="center" gap={2} width="100%">
      {!!fields?.length && (
        <StyledPaper>
          <List sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%', padding: 2 }}>
            {fields?.map((response, index) => (
              <form key={response.key} onSubmit={handleSubmit(onSubmit)}>
                <Accordion variant="outlined" expanded={expanded === response.id} onChange={handleChange(response.id)}>
                  <AccordionSummary aria-controls="response1-content" id="response1-header">
                    <ListItem
                      disablePadding
                      disableGutters
                      secondaryAction={
                        <Stack direction="row" alignItems="center">
                          <Button color="primary" variant="contained" size="small" onClick={() => router.push(`/responses/${response.id}/chat`)}>
                            Chat
                          </Button>
                          <Controller
                            control={control}
                            name={`responses.${index}.selected`}
                            render={({ field }) => (
                              <RadioGroup
                                row
                                {...field}
                                onChange={async (event, value) => {
                                  field.onChange(value);
                                  await onVendorChange(response.id);
                                }}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Radio value="true" />
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
                        primary={
                          <Stack component="span" direction="row" alignItems="center" gap={1}>
                            {response.vendor.businessName}
                            <Badge
                              slotProps={{ badge: { style: { position: 'relative', transform: 'translate(0, 0)' } } }}
                              component="div"
                              color={VendorResponseStatusColorMap[response.status]}
                              badgeContent={response.status}
                            />
                          </Stack>
                        }
                        secondary={
                          <Stack component="span" direction="row" alignItems="center" gap={1}>
                            {response?.eta && (
                              <Typography sx={{ display: 'inline' }} component="span" variant="body2" color="text.secondary">
                                {response.eta.slice(0, 5)}
                              </Typography>
                            )}
                            {response?.eta && (
                              <Typography sx={{ display: 'inline' }} component="span" variant="body2" color="text.primary" fontWeight={700}>
                                {`$${response.quote}`}
                              </Typography>
                            )}
                          </Stack>
                        }
                      />
                    </ListItem>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Stack gap={2}>
                      <Stack direction="row" gap={2}>
                        <Button
                          variant={response.markup === 25 ? 'contained' : 'outlined'}
                          color="info"
                          size="small"
                          onClick={() => update(index, { ...response, markup: 25, price: Math.fround(Number(response.quote) + Number(response.quote) * 0.25) })}
                        >
                          +25%
                        </Button>
                        <Button
                          variant={response.markup === 50 ? 'contained' : 'outlined'}
                          color="info"
                          size="small"
                          onClick={() => update(index, { ...response, markup: 50, price: Number(response.quote) + Number(response.quote) * 0.5 })}
                        >
                          +50%
                        </Button>
                        <Button
                          variant={response.markup === 75 ? 'contained' : 'outlined'}
                          color="info"
                          size="small"
                          onClick={() => update(index, { ...response, markup: 75, price: Number(response.quote) + Number(response.quote) * 0.75 })}
                        >
                          +75%
                        </Button>
                        <Button
                          variant={response.markup === 100 ? 'contained' : 'outlined'}
                          color="info"
                          size="small"
                          onClick={() => update(index, { ...response, markup: 100, price: Number(response.quote) + Number(response.quote) })}
                        >
                          +100%
                        </Button>
                      </Stack>
                      <Stack direction="row" alignItems="center" gap={2}>
                        <Controller
                          control={control}
                          name={`responses.${index}.price`}
                          render={({ field }) => <TextField {...field} size="small" InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }} />}
                        />
                        <Button type="submit" variant="contained" size="small" disabled={!response.selected || response.status !== VendorResponseStatus.QUOTED}>
                          Send price
                        </Button>
                      </Stack>
                    </Stack>
                  </AccordionDetails>
                </Accordion>
              </form>
            ))}
          </List>
        </StyledPaper>
      )}
    </Stack>
  );
}
