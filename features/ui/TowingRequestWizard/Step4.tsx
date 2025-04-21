import Typography from '@mui/material/Typography';
import { Stack, TextField } from '@mui/material';
import { selectServiceRequest, setServiceRequest, setServiceRequestUpdating } from '@/entities/serviceRequest/serviceRequestSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { AccountDto } from '@/entities/account/api/dto/AccountDto';
import { StepProps } from '@/features/ui/ServiceRequestWizard/Step1';
import { useLoginUserMutation, useVerifyUserMutation } from '@/entities/account/api/accountApi';
import React, { useEffect } from 'react';
import { useCreateServiceRequestMutation } from '@/entities/serviceRequest/api/serviceRequestApi';
import { useRouter } from 'next/navigation';
import { setUserSession } from '@/entities/account/authSlice';
import { Loader } from '@googlemaps/js-api-loader';
import TowingRequestSummary from '@/features/ui/TowingRequestSummary/TowingRequestSummary';
import { StyledPaper } from '@/features/ui/Paper/Paper';
import { TowingRequest } from '@/entities/serviceRequest/api/dto/TowingRequest';

const loader = new Loader({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  version: 'weekly',
  libraries: ['places', 'geometry', 'marker', 'routes'],
});

export function Step4(props: StepProps) {
  const { formRef, goToNextStep } = props;
  const serviceRequest = useSelector(selectServiceRequest) as TowingRequest;
  const dispatch = useDispatch();
  const router = useRouter();
  const [verifyUser, { isLoading: isVerifyLoading }] = useVerifyUserMutation();
  const [createServiceRequest, { isLoading: isServiceRequestLoading }] = useCreateServiceRequestMutation();
  const [login, { isLoading: isLoggingIn }] = useLoginUserMutation();

  const verificationMethods = useForm<AccountDto['verification']>({
    values: {
      userId: serviceRequest.client?.id,
      verificationToken: serviceRequest.client?.verificationToken,
    },
  });
  const isLoading = isServiceRequestLoading || isVerifyLoading;
  const user = serviceRequest.client;

  const handleStepSubmit = async (data: AccountDto['verification']) => {
    if (user?.id) {
      const result = await verifyUser({ ...data, userId: user.id }).unwrap();
      if (result && user.email && data.verificationToken) {
        const session = await login({ email: user.email, password: data.verificationToken }).unwrap();
        dispatch(setUserSession(session));
        dispatch(setServiceRequest({ client: { ...serviceRequest.client, ...data, ...result } }));
      }
    }
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
      <TowingRequestSummary serviceRequest={serviceRequest} />
      <StyledPaper>
        <Stack direction="row" display="flex" flexWrap="wrap" gap={3} width={1} p={2}>
          <Typography variant="subtitle1" fontWeight={700} textAlign="left">
            To immediately connect with an agent on chat, please verify your email.
          </Typography>
          {user && (
            <form onSubmit={verificationMethods.handleSubmit(handleStepSubmit)} ref={formRef} style={{ width: '100%' }}>
              <Stack gap={2} flex={1} width={1}>
                <Typography align="left">A 6-digit code was sent to your email</Typography>
                <TextField
                  {...verificationMethods.register('verificationToken', { required: true })}
                  label="Verification code"
                  placeholder="Enter 6-digit code from email"
                  fullWidth
                  error={Boolean(verificationMethods.formState.errors.verificationToken)}
                />
              </Stack>
            </form>
          )}
        </Stack>
      </StyledPaper>
    </Stack>
  );
}
