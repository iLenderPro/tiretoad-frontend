import Typography from '@mui/material/Typography';
import { Avatar, Card, CardMedia, CircularProgress, InputAdornment, Stack, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import { selectServiceRequest, setServiceRequest, setServiceRequestUpdating } from '@/entities/serviceRequest/serviceRequestSlice';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@mui/material/Button';
import { useForm } from 'react-hook-form';
import { getStaticMapImage } from '@/features/utils/mapUtils';
import { selectPlacesWithinRadius } from '@/entities/vendors/vendorSlice';
import { TireSide } from '@/features/ui/ServiceRequestWizard/types/TireSide';
import { TireDamage } from '@/features/ui/ServiceRequestWizard/types/TireDamage';
import { AccountDto } from '@/entities/account/api/dto/AccountDto';
import { StepProps } from '@/features/ui/ServiceRequestWizard/Step1';
import { useLoginUserMutation, useRegisterUserMutation, useVerifyUserMutation } from '@/entities/account/api/accountApi';
import { ServiceRequestDto } from '@/entities/serviceRequest/api/dto/ServiceRequestDto';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import React, { useEffect } from 'react';
import { useCreateServiceRequestMutation } from '@/entities/serviceRequest/api/serviceRequestApi';
import { useRouter } from 'next/navigation';
import { TireType } from '@/features/ui/ServiceRequestWizard/types/TireType';
import { setUserSession } from '@/entities/account/authSlice';

export function Step4(props: StepProps) {
  const { formRef, goToNextStep } = props;
  const serviceRequest = useSelector(selectServiceRequest);
  const placesWithinRadius = useSelector(selectPlacesWithinRadius);
  const dispatch = useDispatch();
  const router = useRouter();
  const [registerUser, { isLoading: isRegisterLoading }] = useRegisterUserMutation();
  const [verifyUser, { isLoading: isVerifyLoading }] = useVerifyUserMutation();
  const [createServiceRequest, { isLoading: isServiceRequestLoading }] = useCreateServiceRequestMutation();
  const [login, { isLoading: isLoggingIn }] = useLoginUserMutation();

  const { register, handleSubmit, setValue, watch } = useForm<Pick<ServiceRequestDto, 'client'>>({ values: serviceRequest });
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
      <Typography variant="h4">Confirm Your Request</Typography>
      <Typography>
        The <strong>{TireSide[serviceRequest.tires[0].side as keyof typeof TireSide]} Tire</strong> on your{' '}
        <strong>
          {serviceRequest.vehicle.year} {serviceRequest.vehicle.model} {serviceRequest.vehicle.trim}
          {serviceRequest.vehicle.vin && ` (${serviceRequest.vehicle.vin})`}
        </strong>{' '}
        has a <strong>{TireDamage[serviceRequest.tires[0].damage as keyof typeof TireDamage]}</strong>
      </Typography>
      <Typography>
        The tire you've selected is{' '}
        <strong>
          {serviceRequest.tires[0].size} ({TireType[serviceRequest.tires[0].type as keyof typeof TireType]})
        </strong>
      </Typography>
      <Typography>
        The vehicle is located at <strong>{serviceRequest.location.address}</strong>
      </Typography>
      <Typography>
        <strong>Comment: </strong>
        {serviceRequest.location.comment}
      </Typography>
      <Typography variant="h5">Images of your damage and tire wall</Typography>
      <Stack direction="row" maxWidth="566px" gap={3} flexWrap="nowrap" alignItems="center">
        <Box flex={1}>
          <Card>
            <CardMedia component="img" width={1} image={`https://tiretoad-data-bucket.s3.amazonaws.com/tmp/${serviceRequest.tires[0].imageOfDamage}`} />
          </Card>
        </Box>
        <Box flex={1}>
          <Card>
            <CardMedia width={1} component="img" image={`https://tiretoad-data-bucket.s3.amazonaws.com/tmp/${serviceRequest.tires[0].imageOfTireWall}`} />
          </Card>
        </Box>
      </Stack>
      <Button variant="text">Change tires or damage</Button>
      <Typography>
        We have <strong>{placesWithinRadius.length}</strong> mobile tire repair shops near you <br />
        and can have you back on the road in as little as 30 min
      </Typography>
      <Button variant="text">Change address</Button>
      <Stack direction="row" display="flex" flexWrap="wrap" gap={3} width={1}>
        <Box maxWidth="600px" style={{ overflowX: 'hidden' }}>
          <img src={mapUrl} alt="TireToad services around you" width="600" height="400" style={{ marginLeft: '50%', transform: 'translateX(-50%)' }} />
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
