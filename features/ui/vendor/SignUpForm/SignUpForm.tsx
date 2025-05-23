'use client';
import { Controller, useForm } from 'react-hook-form';
import { AccountDto } from '@/entities/account/api/dto/AccountDto';
import { Avatar, CircularProgress, InputAdornment, MenuItem, Stack, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import React, { useState } from 'react';
import { useLoginUserMutation, useRegisterVendorMutation, useVerifyUserMutation } from '@/entities/account/api/accountApi';
import { setUserSession } from '@/entities/account/authSlice';
import { VendorDto } from '@/entities/user/api/dto/VendorDto';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { showSnackbar } from '@/shared/ui/Snackbar/model/snackbarSlice';

export default function SignUpForm({ redirectUrl }: { redirectUrl?: string }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [registerVendor, { isLoading: isRegisterLoading }] = useRegisterVendorMutation();
  const [verifyUser, { isLoading: isVerifyLoading }] = useVerifyUserMutation();
  const [login, { isLoading: isLoggingIn }] = useLoginUserMutation();
  const [user, setUser] = useState<VendorDto>();

  const registerMethods = useForm<VendorDto>();
  const verificationMethods = useForm<AccountDto['verification']>();

  const isLoading = isRegisterLoading || isVerifyLoading;

  const handleRegisterSubmit = async (data: VendorDto) => {
    const result = await registerVendor(data)
      .unwrap()
      .then((payload) => setUser({ ...data, ...payload }))
      .catch((error) => dispatch(showSnackbar({ type: 'error', content: error.data.message })));
  };

  const handleVerificationSubmit = async (data: { verificationToken?: string }) => {
    if (user?.id) {
      const result = await verifyUser({ ...data, userId: user.id }).unwrap();
      if (result) {
        if (user.email && user.password) {
          const session = await login({ email: user.email, password: user.password }).unwrap();
          dispatch(setUserSession(session));
          result && router.push(redirectUrl ? redirectUrl : '/');
        }
      }
    }
  };

  return (
    <Stack width={1} maxWidth="500px" gap={2}>
      <form onSubmit={registerMethods.handleSubmit(handleRegisterSubmit)} style={{ width: '100%' }}>
        <Stack gap={2} flex={1} width={1}>
          <TextField
            {...registerMethods.register('fullName', { required: { value: true, message: 'Name is required' } })}
            label="Contact name"
            placeholder="Person for contact"
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
            {...registerMethods.register('businessName', {
              required: {
                value: true,
                message: 'Business name is required',
              },
            })}
            label="Business name"
            placeholder="Business name"
            fullWidth
            error={Boolean(registerMethods.formState.errors.businessName)}
            helperText={registerMethods.formState.errors.businessName?.message}
          />
          <TextField
            {...registerMethods.register('addresses.0.line1', {
              required: {
                value: true,
                message: 'Business address',
              },
            })}
            label="Business address"
            placeholder="Business address"
            fullWidth
            error={Boolean(registerMethods.formState.errors.addresses?.[0]?.line1)}
            helperText={registerMethods.formState.errors.addresses?.[0]?.line1?.message}
          />
          <input type="hidden" {...registerMethods.register('addresses.0.country')} defaultValue="US" />
          <TextField
            {...registerMethods.register('addresses.0.city', {
              required: {
                value: true,
                message: 'City is required',
              },
            })}
            label="City"
            placeholder="City"
            fullWidth
            error={Boolean(registerMethods.formState.errors.addresses?.[0]?.city)}
            helperText={registerMethods.formState.errors.addresses?.[0]?.city?.message}
          />
          <Controller
            rules={{ required: { value: true, message: 'State is required' } }}
            control={registerMethods.control}
            name="addresses.0.state"
            defaultValue="FL"
            render={({ field }) => (
              <TextField
                label="State"
                select
                fullWidth
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                error={Boolean(registerMethods.formState.errors.addresses?.[0]?.state)}
                helperText={registerMethods.formState.errors.addresses?.[0]?.state?.message}
              >
                <MenuItem key="FL" value="FL">
                  Florida (FL)
                </MenuItem>
              </TextField>
            )}
          />

          <TextField
            {...registerMethods.register('addresses.0.zip', {
              required: {
                value: true,
                message: 'ZIP code is required',
              },
            })}
            label="ZIP code"
            placeholder="ZIP code"
            fullWidth
            error={Boolean(registerMethods.formState.errors.addresses?.[0]?.zip)}
            helperText={registerMethods.formState.errors.addresses?.[0]?.zip?.message}
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
            <Button variant="contained" type="submit" size="large" disabled={isLoading || user.active} endIcon={isLoading ? <CircularProgress color="inherit" size="1em" /> : null}>
              Verify
            </Button>
          </Stack>
        </form>
      )}
    </Stack>
  );
}
