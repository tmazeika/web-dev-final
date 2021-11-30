import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import Layout from '../components/Layout';
import useAuth from '../hooks/useAuth';
import useForm from '../hooks/useForm';

const Login: NextPage = () => {
  const [isBadLogin, setIsBadLogin] = useState(false);
  const router = useRouter();
  const auth = useAuth();
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    onValidate(values, errors) {
      if (values.email.length === 0) {
        errors.email = 'Please enter your email';
      }
      if (values.password.length === 0) {
        errors.password = 'Please enter your password';
      }
    },
    async onSubmit(values) {
      return auth
        .logIn(values.email, values.password)
        .then(() => {
          void router.push('/');
        })
        .catch(() => {
          setIsBadLogin(true);
        });
    },
  });

  return (
    <Layout>
      <Container maxWidth="sm">
        <Stack py={5} spacing={5}>
          <Typography variant="h2">Log In</Typography>
          {isBadLogin && (
            <Alert severity="error">Invalid email or password.</Alert>
          )}
          <Stack component="form" spacing={3} onSubmit={form.onSubmit}>
            <TextField
              type="email"
              label="Email"
              variant="filled"
              value={form.values.email}
              onChange={(e) => form.set('email', e.target.value)}
              error={form.errors.email !== undefined}
              helperText={form.errors.email}
            />
            <TextField
              type="password"
              label="Password"
              variant="filled"
              value={form.values.password}
              onChange={(e) => form.set('password', e.target.value)}
              error={form.errors.password !== undefined}
              helperText={form.errors.password}
            />
            <Button type="submit">Log in</Button>
          </Stack>
        </Stack>
      </Container>
    </Layout>
  );
};

export default Login;
