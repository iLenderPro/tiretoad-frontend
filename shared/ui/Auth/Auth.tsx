'use client';
import { selectUserSession, setUserSession } from '@/entities/account/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useGetUserSessionQuery } from '@/entities/account/api/accountApi';
import { PropsWithChildren, useEffect } from 'react';
import { redirect, usePathname } from 'next/navigation';

export default function Auth({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const session = useSelector(selectUserSession);
  const { data } = useGetUserSessionQuery(undefined, { pollingInterval: 5 * 60 * 1000 });
  console.log('session', session);
  useEffect(() => {
    data && dispatch(setUserSession({ user: data }));
  }, [data, dispatch]);

  useEffect(() => {
    if (!session?.authToken && pathname !== '/' && pathname !== '/login') {
      redirect('/login?redirect_url=' + pathname);
    }
  }, []);

  return children;
}
