import CssBaseline from '@mui/material/CssBaseline';
import Head from 'next/head';
import type { FC, PropsWithChildren } from 'react';
import React from 'react';

const Layout: FC = ({ children }: PropsWithChildren<unknown>): JSX.Element => (
  <>
    <Head>
      <meta name='viewport' content='initial-scale=1, width=device-width' />
      <title>My App</title>
    </Head>
    <CssBaseline />
    {children}
  </>
);

export default Layout;
