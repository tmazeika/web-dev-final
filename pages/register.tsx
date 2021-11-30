import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Layout from '../components/Layout';
import useAuth from '../hooks/useAuth';
import useForm from '../hooks/useForm';

const Register: NextPage = () => {
  const [isBadRegister, setIsBadRegister] = useState(false);
  const router = useRouter();
  const auth = useAuth();
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
      passwordConfirm: '',
    },
    onValidate(values, errors) {
      if (values.email.length === 0) {
        errors.email = 'Please enter an email';
      }
      if (values.password.length < 8) {
        errors.password = 'Password must be at least 8 characters';
      }
      if (values.password !== values.passwordConfirm) {
        if (errors.password === undefined) {
          // Still invalidate the password field but without a message, unless it's of insufficient length, in which
          // case there's already a message here.
          errors.password = '';
        }
        errors.passwordConfirm = 'Passwords do not match';
      }
    },
    async onSubmit(values) {
      return auth
        .register(values.email, values.password)
        .then(() => {
          void router.push('/');
        })
        .catch(() => {
          setIsBadRegister(true);
        });
    },
  });

  return (
    <Layout>
      <Container maxWidth="sm">
        <Stack py={5} spacing={5}>
          <Typography variant="h2">Register</Typography>
          {isBadRegister && (
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
            <TextField
              type="password"
              label="Confirm password"
              variant="filled"
              value={form.values.passwordConfirm}
              onChange={(e) => form.set('passwordConfirm', e.target.value)}
              error={form.errors.passwordConfirm !== undefined}
              helperText={form.errors.passwordConfirm}
            />
            <Button type="submit">Create account</Button>
          </Stack>
        </Stack>
      </Container>
    </Layout>
  );
};

export default Register;
