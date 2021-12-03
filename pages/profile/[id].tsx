import FastfoodIcon from '@mui/icons-material/Fastfood';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import useAuth from '../../hooks/useAuth';
import useForm from '../../hooks/useForm';
import useUserDetails from '../../hooks/useUserDetails';

const Details: NextPage = () => {
  const router = useRouter();
  const { id: userId } = router.query;
  const userDetails = useUserDetails(typeof userId === 'string' ? userId : '');
  const auth = useAuth();
  const [isGoodSave, setIsGoodSave] = useState(false);
  const [isBadSave, setIsBadSave] = useState(false);
  const { set, ...form } = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    onValidate(values, errors) {
      if (values.email.length === 0) {
        errors.email = 'Please enter an email';
      }
    },
    async onSubmit(values) {
      try {
        await auth.changeEmail(values.email, values.password);
      } catch (e) {
        setIsGoodSave(false);
        setIsBadSave(true);
        return;
      }
      setIsGoodSave(true);
      setIsBadSave(false);
      form.reset();
      set('email', values.email);
    },
  });

  const authName = auth.user.isAnonymous ? null : auth.user.name;
  useEffect(() => {
    if (authName !== null) {
      set('email', authName);
    }
  }, [authName, set]);

  return (
    <Layout>
      <Container maxWidth="sm">
        {userDetails !== null && (
          <Stack py={5} spacing={2}>
            <Stack direction="row" alignItems="center" gap={2}>
              <Typography variant="h4">{userDetails?.name}</Typography>
              {userDetails.role === 'nutritionist' && (
                <Tooltip title="Nutritionist">
                  <LocalDiningIcon fontSize="large" color="primary" />
                </Tooltip>
              )}
              {userDetails.role === 'foodie' && (
                <Tooltip title="Foodie">
                  <FastfoodIcon fontSize="large" color="primary" />
                </Tooltip>
              )}
            </Stack>
            <Divider />
            {isGoodSave && (
              <Alert severity="success" onClose={() => setIsGoodSave(false)}>
                Email updated.
              </Alert>
            )}
            {isBadSave && (
              <Alert severity="error" onClose={() => setIsBadSave(false)}>
                Bad email or password.
              </Alert>
            )}
            {!auth.user.isAnonymous && userDetails.isSelf ? (
              <Stack
                component="form"
                spacing={3}
                onSubmit={form.onSubmit}
                alignItems="flex-start"
              >
                <Stack direction="row" alignItems="center" gap={2}>
                  <TextField
                    type="email"
                    label="Email"
                    variant="filled"
                    value={form.values.email}
                    onChange={(e) => set('email', e.target.value)}
                    error={form.errors.email !== undefined}
                    helperText={form.errors.email}
                  />
                  <TextField
                    type="password"
                    label="Password"
                    variant="filled"
                    value={form.values.password}
                    onChange={(e) => set('password', e.target.value)}
                    error={form.errors.password !== undefined}
                    helperText={form.errors.password}
                    disabled={form.values.email === auth.user.name}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={form.values.password.length === 0}
                  >
                    Save
                  </Button>
                </Stack>
              </Stack>
            ) : (
              <></>
            )}
          </Stack>
        )}
      </Container>
    </Layout>
  );
};

export default Details;
