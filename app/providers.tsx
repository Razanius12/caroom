'use client';

import { Provider } from 'react-redux';
import { store } from '@/app/lib/store';

export function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>{children}</Provider>
      </body>
    </html>
  );
}
