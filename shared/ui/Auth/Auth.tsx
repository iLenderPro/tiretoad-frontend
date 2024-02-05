'use client';
import { setUserSession } from '@/entities/account/authSlice';
import { useDispatch } from 'react-redux';
import { useGetUserSessionQuery } from '@/entities/account/api/accountApi';
import { useEffect } from 'react';

export default function Auth() {
  const dispatch = useDispatch();
  const { data } = useGetUserSessionQuery(undefined, { pollingInterval: 60 * 1000 });

  useEffect(() => {
    data && dispatch(setUserSession({ user: data }));
  }, [data, dispatch]);

  return <></>;
}
