'use client';
import { useForm } from 'react-hook-form';
import { AccountDto } from '@/entities/account/api/dto/AccountDto';
import { useLoginUserMutation } from '@/entities/account/api/accountApi';
import { CircularProgress, Stack, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import { useDispatch } from 'react-redux';
import { setUserSession } from '@/entities/account/authSlice';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function UserLoginForm({ redirectUrl }: { redirectUrl?: string }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginUserMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AccountDto['login']>();

  const handleLogin = async (data: AccountDto['login']) => {
    const result = await login(data).unwrap();
    result && dispatch(setUserSession(result));
    result && router.push(redirectUrl ? redirectUrl : '/');
  };

  return (
    <form onSubmit={handleSubmit(handleLogin)} style={{ maxWidth: '500px', width: '100%' }}>
      <Stack width={1} gap={2}>
        <TextField
          {...register('email', { required: { value: true, message: 'Email is required' } })}
          label="Email"
          placeholder="Your email"
          fullWidth
          error={Boolean(errors.email)}
          helperText={errors.email?.message}
        />
        <TextField
          {...register('password', {
            required: {
              value: true,
              message: 'Password is required',
            },
          })}
          label="Password"
          placeholder="Create password"
          type="password"
          fullWidth
          error={Boolean(errors.password)}
          helperText={errors.password?.message}
        />
        <Button variant="contained" type="submit" size="large" disabled={isLoading} endIcon={isLoading ? <CircularProgress color="inherit" size="1em" /> : null}>
          Submit
        </Button>
      </Stack>
    </form>
  );
}
