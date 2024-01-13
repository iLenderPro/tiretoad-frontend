import Typography from '@mui/material/Typography';
import { Avatar, CircularProgress, InputAdornment, Stack, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import { selectServiceRequest, setServiceRequest } from '@/entities/serviceRequest/serviceRequestSlice';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@mui/material/Button';
import { useForm } from 'react-hook-form';
import { getStaticMapImage } from '@/features/utils/mapUtils';
import { selectPlacesWithinRadius } from '@/entities/vendors/vendorSlice';
import { TireSide } from '@/features/ui/ServiceRequestWizard/types/TireSide';
import { TireDamage } from '@/features/ui/ServiceRequestWizard/types/TireDamage';
import { AccountDto } from '@/entities/account/api/dto/AccountDto';
import { StepProps } from '@/features/ui/ServiceRequestWizard/Step1';
import { useRegisterUserMutation, useVerifyUserMutation } from '@/entities/account/api/accountApi';
import { ServiceRequestDto } from '@/entities/serviceRequest/api/dto/ServiceRequestDto';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import React from 'react';
import { useCreateServiceRequestMutation } from '@/entities/serviceRequest/api/serviceRequestApi';

export function Step4(props: StepProps) {
  const { formRef, goToNextStep } = props;
  const serviceRequest = useSelector(selectServiceRequest);
  const placesWithinRadius = useSelector(selectPlacesWithinRadius);
  const dispatch = useDispatch();
  const [registerUser, { isLoading: isRegisterLoading }] = useRegisterUserMutation();
  const [verifyUser, { isLoading: isVerifyLoading }] = useVerifyUserMutation();
  const [createServiceRequest, { isLoading: isServiceRequestLoading }] = useCreateServiceRequestMutation();

  const { register, handleSubmit, setValue, watch } = useForm<Pick<ServiceRequestDto, 'user'>>({ values: serviceRequest });
  const registerMethods = useForm<AccountDto['registration']>({ values: serviceRequest.user });
  const verificationMethods = useForm<AccountDto['verification']>({
    values: {
      userId: serviceRequest.user?.id,
      verificationToken: serviceRequest.user?.verificationToken,
    },
  });
  const isLoading = isRegisterLoading || isVerifyLoading;
  const user = watch('user');
  const mapUrl = getStaticMapImage(serviceRequest.location, placesWithinRadius);

  const handleRegisterSubmit = async (data: AccountDto['registration']) => {
    const result = await registerUser(data).unwrap();
    setValue('user', { ...data, ...result });
    dispatch(setServiceRequest({ user: { ...serviceRequest.user, ...data, ...result } }));
  };

  const handleVerificationSubmit = async (data: { verificationToken?: string }) => {
    if (user?.id) {
      const result = await verifyUser({ ...data, userId: user.id }).unwrap();
      if (result) {
        setValue('user', { ...data, ...result });
        dispatch(setServiceRequest({ user: { ...serviceRequest.user, ...data, ...result } }));
      }
    }
  };

  const handleStepSubmit = async (data: Pick<ServiceRequestDto, 'user'>) => {
    await createServiceRequest(serviceRequest);
  };

  return (
    <Stack alignItems="center" gap={3}>
      <Typography variant="h4">Confirm Your Request</Typography>
      <Typography>
        The {TireSide[serviceRequest.tires[0].side as keyof typeof TireSide]} tire on your {serviceRequest.vehicle.year} {serviceRequest.vehicle.model}{' '}
        {serviceRequest.vehicle.trim} has a {TireDamage[serviceRequest.tires[0].damage as keyof typeof TireDamage]}
      </Typography>
      <Typography>The tire you've selected is {serviceRequest.tires[0].size}</Typography>
      <Button variant="text">Change tires or damage</Button>
      <Typography>
        We have {placesWithinRadius.length} mobile tire repair shops near you <br />
        and can have you back on the road in as little as 30 min
      </Typography>
      <Typography>The vehicle is located at {serviceRequest.location.address}</Typography>
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
                {...registerMethods.register('fullName', { required: true })}
                label="Full name"
                placeholder="Your full name"
                fullWidth
                error={Boolean(registerMethods.formState.errors.fullName)}
              />
              <TextField
                {...registerMethods.register('email', { required: true })}
                label="Email"
                placeholder="Your email"
                fullWidth
                error={Boolean(registerMethods.formState.errors.email)}
              />
              <TextField
                {...registerMethods.register('phone', { required: true })}
                label="Phone"
                placeholder="Contact phone number"
                fullWidth
                error={Boolean(registerMethods.formState.errors.phone)}
              />
              <TextField
                {...registerMethods.register('password', { required: true })}
                label="Password"
                placeholder="Create password"
                type="password"
                fullWidth
                error={Boolean(registerMethods.formState.errors.password)}
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
            <input type="hidden" {...register('user')} defaultValue={undefined} />
          </form>
        </Stack>
      </Stack>
    </Stack>
  );
}
