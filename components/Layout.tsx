import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Head from 'next/head';
import type { FC, PropsWithChildren } from 'react';
import React from 'react';
import Header from './Header';

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const Layout: FC<PropsWithChildren<unknown>> = ({ children }) => (
  <ThemeProvider theme={theme}>
    <Head>
      <meta name="viewport" content="initial-scale=1, width=device-width" />
      <title>Cookbook</title>
    </Head>
    <CssBaseline />
    <Header />
    <Container maxWidth="md">{children}</Container>
  </ThemeProvider>
);

export default Layout;
