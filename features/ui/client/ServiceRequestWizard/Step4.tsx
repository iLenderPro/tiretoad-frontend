import Typography from '@mui/material/Typography';
import { Avatar, Card, CardMedia, CircularProgress, InputAdornment, List, ListItem, ListItemIcon, ListItemText, Stack, TextField, Tooltip } from '@mui/material';
import Box from '@mui/material/Box';
import { selectServiceRequest, setServiceRequest, setServiceRequestUpdating } from '@/entities/serviceRequest/serviceRequestSlice';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@mui/material/Button';
import { useForm } from 'react-hook-form';
import { getStaticMapImage } from '@/features/utils/mapUtils';
import { selectPlacesWithinRadius } from '@/entities/vendors/vendorSlice';
import { TireSide } from '@/features/ui/client/ServiceRequestWizard/types/TireSide';
import { TireDamage } from '@/features/ui/client/ServiceRequestWizard/types/TireDamage';
import { AccountDto } from '@/entities/account/api/dto/AccountDto';
import { StepProps } from '@/features/ui/client/ServiceRequestWizard/Step1';
import { useLoginUserMutation, useRegisterUserMutation, useVerifyUserMutation } from '@/entities/account/api/accountApi';
import { ServiceRequestDto } from '@/entities/serviceRequest/api/dto/ServiceRequestDto';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import React, { useEffect } from 'react';
import { useCreateServiceRequestMutation } from '@/entities/serviceRequest/api/serviceRequestApi';
import { useRouter } from 'next/navigation';
import { TireType } from '@/features/ui/client/ServiceRequestWizard/types/TireType';
import { setUserSession } from '@/entities/account/authSlice';
import { Loader } from '@googlemaps/js-api-loader';
import { TireRepairRequest } from '@/entities/serviceRequest/api/dto/TireRepairRequest';

const loader = new Loader({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  version: 'weekly',
  libraries: ['places', 'geometry', 'marker', 'routes'],
});

export function Step4(props: StepProps) {
  const { formRef, goToNextStep } = props;
  const serviceRequest = useSelector(selectServiceRequest) as TireRepairRequest;
  const placesWithinRadius = useSelector(selectPlacesWithinRadius);
  const dispatch = useDispatch();
  const router = useRouter();
  const [registerUser, { isLoading: isRegisterLoading }] = useRegisterUserMutation();
  const [verifyUser, { isLoading: isVerifyLoading }] = useVerifyUserMutation();
  const [createServiceRequest, { isLoading: isServiceRequestLoading }] = useCreateServiceRequestMutation();
  const [login, { isLoading: isLoggingIn }] = useLoginUserMutation();

  const { register, handleSubmit, setValue, watch } = useForm<Pick<TireRepairRequest, 'client'>>({ values: serviceRequest });
  const registerMethods = useForm<AccountDto['registration']>({ values: serviceRequest.client });
  const verificationMethods = useForm<AccountDto['verification']>({
    values: {
      userId: serviceRequest.client?.id,
      verificationToken: serviceRequest.client?.verificationToken,
    },
  });
  const isLoading = isRegisterLoading || isVerifyLoading;
  const user = watch('client');
  const mapUrl = getStaticMapImage(serviceRequest.location, placesWithinRadius);

  const handleRegisterSubmit = async (data: AccountDto['registration']) => {
    const result = await registerUser(data).unwrap();
    setValue('client', { ...data, ...result });
    dispatch(setServiceRequest({ client: { ...serviceRequest.client, ...data, ...result } }));
  };

  const handleVerificationSubmit = async (data: { verificationToken?: string }) => {
    if (user?.id) {
      const result = await verifyUser({ ...data, userId: user.id }).unwrap();
      if (result) {
        setValue('client', { ...data, ...result });
        dispatch(setServiceRequest({ client: { ...serviceRequest.client, ...data, ...result } }));
        if (user.email && user.password) {
          const session = await login({ email: user.email, password: user.password }).unwrap();
          dispatch(setUserSession(session));
        }
      }
    }
  };

  const handleStepSubmit = async (data: Pick<ServiceRequestDto, 'client'>) => {
    const savedServiceRequest = await createServiceRequest(serviceRequest).unwrap();
    if (savedServiceRequest) {
      router.push(`/requests/${savedServiceRequest.id}/view`);
    }
  };

  useEffect(() => {
    dispatch(setServiceRequestUpdating(isServiceRequestLoading));
  }, [isServiceRequestLoading]);

  return (
    <Stack alignItems="center" gap={3}>
      <Typography>
        We have <strong>{placesWithinRadius.length}</strong> mobile tire repair shops near you <br />
        and can have you back on the road in as little as 30 min
      </Typography>
      <Typography variant="h3">Confirm Your Request</Typography>
      <Typography variant="h2">
        {TireDamage[serviceRequest.tires[0].damage as keyof typeof TireDamage]} Tire Service for {TireSide[serviceRequest.tires[0].side as keyof typeof TireSide]} Tire
      </Typography>
      <Stack alignItems="start" textAlign="left">
        <List>
          <ListItem disablePadding>
            <ListItemIcon style={{ minWidth: 32 }}>
              <CheckOutlinedIcon color="success" />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography fontWeight="bold">
                  Vehicle: {serviceRequest.vehicle.year} {serviceRequest.vehicle.model} {serviceRequest.vehicle.trim}
                </Typography>
              }
            />
          </ListItem>
          <ListItem disablePadding>
            <ListItemIcon style={{ minWidth: 32 }}>
              <CheckOutlinedIcon color="success" />
            </ListItemIcon>
            <ListItemText primary={<Typography fontWeight="bold">VIN #: {serviceRequest.vehicle.vin && ` (${serviceRequest.vehicle.vin})`}</Typography>} />
          </ListItem>
          <ListItem disablePadding>
            <ListItemIcon style={{ minWidth: 32 }}>
              <CheckOutlinedIcon color="success" />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography fontWeight="bold">
                  Tire Size: {serviceRequest.tires[0].size} ({TireType[serviceRequest.tires[0].type as keyof typeof TireType]})
                </Typography>
              }
            />
          </ListItem>
          <ListItem disablePadding>
            <ListItemIcon style={{ minWidth: 32 }}>
              <CheckOutlinedIcon color="success" />
            </ListItemIcon>
            <ListItemText
              primary={
                <Tooltip title={serviceRequest.location.address}>
                  <Typography
                    style={{
                      display: 'inline-block',
                      maxWidth: '18rem',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      verticalAlign: 'middle',
                    }}
                  >
                    <strong>Location:</strong> {serviceRequest.location.address}
                  </Typography>
                </Tooltip>
              }
            />
          </ListItem>
          <ListItem disablePadding>
            <ListItemIcon style={{ minWidth: 32 }}>
              <CheckOutlinedIcon color="success" />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography>
                  <strong>Location Description:</strong> {serviceRequest.location.comment}
                </Typography>
              }
            />
          </ListItem>
        </List>
      </Stack>

      <Typography variant="h6">Damage tire and tire wall images</Typography>
      <Stack direction="row" maxWidth="566px" gap={3} flexWrap="nowrap" alignItems="stretch">
        <Box flex={1}>
          <Card>
            <CardMedia component="img" width={1} image={`https://${process.env.NEXT_PUBLIC_S3_BUCKET}.s3.amazonaws.com/${serviceRequest.tires[0].imageOfDamage}`} />
          </Card>
        </Box>
        <Box flex={1}>
          <Card>
            <CardMedia width={1} component="img" image={`https://${process.env.NEXT_PUBLIC_S3_BUCKET}.s3.amazonaws.com/${serviceRequest.tires[0].imageOfTireWall}`} />
          </Card>
        </Box>
      </Stack>
      <Button variant="text" onClick={() => goToNextStep(-2)}>
        Change tire or damage images
      </Button>
      <Stack direction="row" display="flex" flexWrap="wrap" gap={3} width={1}>
        <Box maxWidth="600px" style={{ overflowX: 'hidden' }}>
          <img src={mapUrl} alt="TireToad services around you" width="100%" />
          <Box mt={2}>
            <Button variant="text" onClick={() => goToNextStep(-1)}>
              Change location
            </Button>
          </Box>
        </Box>
        <Stack flex={1} gap={2}>
          <form onSubmit={registerMethods.handleSubmit(handleRegisterSubmit)} style={{ width: '100%' }}>
            <Stack gap={2} flex={1} width={1}>
              <Typography variant="h6" align="center">
                Let's get someone to you right away
              </Typography>
              <TextField
                {...registerMethods.register('fullName', { required: { value: true, message: 'Name is required' } })}
                label="Full name"
                placeholder="Your full name"
                fullWidth
                error={Boolean(registerMethods.formState.errors.fullName)}
                helperText={registerMethods.formState.errors.fullName?.message}
              />
              <TextField
                {...registerMethods.register('email', {
                  required: { value: true, message: 'Email is required' },
                  setValueAs: (value) => value.toLowerCase(),
                })}
                label="Email"
                placeholder="Your email"
                fullWidth
                error={Boolean(registerMethods.formState.errors.email)}
                helperText={registerMethods.formState.errors.email?.message}
              />
              <TextField
                {...registerMethods.register('phone', { required: { value: true, message: 'Phone is required' } })}
                label="Phone"
                placeholder="Contact phone number"
                fullWidth
                error={Boolean(registerMethods.formState.errors.phone)}
                helperText={registerMethods.formState.errors.phone?.message}
              />
              <TextField
                {...registerMethods.register('password', {
                  required: {
                    value: true,
                    message: 'Password is required',
                  },
                })}
                label="Password"
                placeholder="Create password"
                type="password"
                fullWidth
                error={Boolean(registerMethods.formState.errors.password)}
                helperText={registerMethods.formState.errors.password?.message}
              />
              <Button variant="contained" type="submit" size="large" disabled={isLoading || !!user} endIcon={isLoading ? <CircularProgress color="inherit" size="1em" /> : null}>
                Confirm
              </Button>
            </Stack>
          </form>
          {user && (
            <form onSubmit={verificationMethods.handleSubmit(handleVerificationSubmit)} style={{ width: '100%' }}>
              <Stack gap={2} flex={1} width={1}>
                <Typography align="center">A 6-digit code was sent to your email</Typography>
                <TextField
                  {...verificationMethods.register('verificationToken', { required: true })}
                  label="Verification code"
                  placeholder="Enter 6-digit code from email"
                  fullWidth
                  error={Boolean(verificationMethods.formState.errors.verificationToken)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Avatar sx={{ bgcolor: user.active ? 'green' : 'lightgray' }}>
                          <CheckOutlinedIcon />
                        </Avatar>
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  variant="contained"
                  type="submit"
                  size="large"
                  disabled={isLoading || user.active}
                  endIcon={isLoading ? <CircularProgress color="inherit" size="1em" /> : null}
                >
                  Verify
                </Button>
              </Stack>
            </form>
          )}
          <form onSubmit={handleSubmit(handleStepSubmit)} ref={formRef}>
            <input type="hidden" {...register('client')} defaultValue={undefined} />
          </form>
        </Stack>
      </Stack>
    </Stack>
  );
}
