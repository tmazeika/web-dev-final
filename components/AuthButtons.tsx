import Button from '@mui/material/Button';
import MuiLink from '@mui/material/Link';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import React, { useState } from 'react';
import useAuth from '../hooks/useAuth';

const AuthButtons: FC = () => {
  const router = useRouter();
  const [showLoggedOut, setShowLoggedOut] = useState(false);
  const auth = useAuth();

  const logOut = async () => {
    await auth.logOut();
    setShowLoggedOut(true);
  };

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Snackbar
        message="Logged out"
        open={showLoggedOut}
        autoHideDuration={6_000}
        onClose={() => setShowLoggedOut(false)}
      />
      {auth.user.isAnonymous ? (
        <>
          <Link href="/login" passHref>
            <MuiLink>
              <Button variant="contained">Log In</Button>
            </MuiLink>
          </Link>
          <Link href="/register" passHref>
            <MuiLink>
              <Button>Register</Button>
            </MuiLink>
          </Link>
        </>
      ) : (
        <>
          <Button
            variant="text"
            color="inherit"
            onClick={() => {
              if (!auth.user.isAnonymous) {
                void router.push(`/profile/${auth.user.id}`);
              }
            }}
          >
            {auth.user.name}
          </Button>
          <Button onClick={logOut}>Log Out</Button>
        </>
      )}
    </Stack>
  );
};

export default AuthButtons;
