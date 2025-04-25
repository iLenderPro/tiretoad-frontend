import Typography from '@mui/material/Typography';
import { Stack, TextField } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { StepProps } from '@/features/ui/client/ServiceRequestWizard/Step1';
import { selectServiceRequest, setServiceRequest } from '@/entities/serviceRequest/serviceRequestSlice';
import { useForm } from 'react-hook-form';
import { StyledPaper } from '@/features/ui/Paper/Paper';
import TowingRequestSummary from '@/features/ui/client/TowingRequestSummary/TowingRequestSummary';
import React from 'react';
import { TowingRequest } from '@/entities/serviceRequest/api/dto/TowingRequest';
import { AccountDto } from '@/entities/account/api/dto/AccountDto';
import { useRegisterUserMutation } from '@/entities/account/api/accountApi';
import { UserRole } from '@/entities/user/api/dto/UserRole';

export function Step3(props: StepProps) {
  const { formRef, goToNextStep } = props;
  const dispatch = useDispatch();
  const serviceRequest = useSelector(selectServiceRequest) as TowingRequest;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AccountDto['registration']>({ values: serviceRequest.client });

  const [registerUser, { isLoading }] = useRegisterUserMutation();

  const handleStepSubmit = async (data: AccountDto['registration']) => {
    const result = await registerUser(data).unwrap();
    dispatch(setServiceRequest({ client: { ...serviceRequest.client, ...data, ...result } }));
    goToNextStep();
  };

  return (
    <form onSubmit={handleSubmit(handleStepSubmit)} ref={formRef}>
      <Stack justifyContent="start" alignItems="center" gap={2} width={1}>
        <TowingRequestSummary serviceRequest={serviceRequest} />
        <StyledPaper>
          <Stack alignItems="left" gap={3} p={2}>
            <Typography variant="subtitle1" fontWeight={700} textAlign="left">
              Please input your personal information
            </Typography>
            <TextField
              {...register('fullName', { required: { value: true, message: 'Name is required' } })}
              label="Full name"
              placeholder="Your full name"
              fullWidth
              error={Boolean(errors.fullName)}
              helperText={errors.fullName?.message}
            />
            <TextField
              {...register('email', {
                required: { value: true, message: 'Email is required' },
                setValueAs: (value) => value.toLowerCase(),
              })}
              label="Email"
              placeholder="Your email"
              fullWidth
              error={Boolean(errors.email)}
              helperText={errors.email?.message}
            />
            <TextField
              {...register('phone', { required: { value: true, message: 'Phone is required' } })}
              label="Phone"
              placeholder="Contact phone number"
              fullWidth
              error={Boolean(errors.phone)}
              helperText={errors.phone?.message}
            />
            <input type="hidden" {...register('role')} value={UserRole.CLIENT} />
            {/*<input type="hidden" {...register('client')} defaultValue={undefined} />*/}
          </Stack>
        </StyledPaper>
      </Stack>
    </form>
  );
}
