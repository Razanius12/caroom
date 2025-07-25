'use client';

import { Provider } from 'react-redux';
import { SessionProvider } from 'next-auth/react';
import { store } from '@/app/lib/store';

export function Providers({
  children,
  session
}: Readonly<{
  children: React.ReactNode;
  session: any;
}>) {
  return (
    <SessionProvider session={session}>
      <Provider store={store}>
        {children}
      </Provider>
    </SessionProvider>
  );
}