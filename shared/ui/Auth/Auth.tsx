'use client';
import { setUserSession } from '@/entities/account/authSlice';
import { useDispatch } from 'react-redux';
import { useGetUserSessionQuery } from '@/entities/account/api/accountApi';
import { PropsWithChildren, useEffect } from 'react';

export default function Auth({ children }: PropsWithChildren) {
  const dispatch = useDispatch();
  // const session = useSelector(selectUserSession);
  const { data } = useGetUserSessionQuery(undefined, { pollingInterval: 5 * 60 * 1000 });

  useEffect(() => {
    data && dispatch(setUserSession({ user: data }));
  }, [data, dispatch]);
  // useEffect(() => {
  //   if (!session?.authToken && pathname !== '/' && pathname !== '/login') {
  //     redirect('/login?redirect_url=' + pathname);
  //   }
  //   console.log(session?.authToken);
  //   if (session?.authToken && session?.user?.role === UserRole.VENDOR && pathname === '/') {
  //     redirect('/requests');
  //   }
  // }, []);

  return children;
}
