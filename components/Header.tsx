import MenuBookIcon from '@mui/icons-material/MenuBook';
import AppBar from '@mui/material/AppBar';
import Grid from '@mui/material/Grid';
import MuiLink from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Link from 'next/link';
import type { FC } from 'react';
import React from 'react';
import AuthButtons from './AuthButtons';
import SearchInput from './SearchInput';

const Header: FC = () => (
  <AppBar position="static">
    <Toolbar>
      <Grid container columnSpacing={{ xs: 2, md: 10 }}>
        <Grid item>
          <Link href="/" passHref>
            <MuiLink variant="h6" color="inherit" underline="none">
              <Stack direction="row" gap={1} alignItems="center">
                <MenuBookIcon />
                Cookbook
              </Stack>
            </MuiLink>
          </Link>
        </Grid>
        <Grid item xs>
          <SearchInput />
        </Grid>
        <Grid item>
          <AuthButtons />
        </Grid>
      </Grid>
    </Toolbar>
  </AppBar>
);

export default Header;
