'use client';

import { Provider } from 'react-redux';
import { SessionProvider } from 'next-auth/react';
import { store } from '@/app/lib/store';
import { BootstrapClient } from './bootstrap-client';

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
        <BootstrapClient />
        {children}
      </Provider>
    </SessionProvider>
  );
}