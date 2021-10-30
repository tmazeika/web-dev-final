import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import type { FC } from 'react';
import React from 'react';
import useUser from '../hooks/useUser';

const AuthButtons: FC = () => {
  const user = useUser();

  return (
    <Stack direction="row" spacing={1}>
      {user.isAnonymous && (
        <>
          <Button variant="contained">Login</Button>
          <Button>Register</Button>
        </>
      )}
    </Stack>
  );
};

export default AuthButtons;
