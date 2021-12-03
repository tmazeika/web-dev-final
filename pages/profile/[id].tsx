import AddCircleIcon from '@mui/icons-material/AddCircle';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
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
  const thisUser = useUserDetails(auth.user.isAnonymous ? '' : auth.user.id);
  const [isGoodSave, setIsGoodSave] = useState(false);
  const [isBadSave, setIsBadSave] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
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

  useEffect(() => {
    if (userDetails !== null && thisUser !== null) {
      setIsFollowing(
        userDetails.followers?.some((f) => f.id === thisUser.id) ?? false,
      );
    }
  }, [userDetails, thisUser]);

  const onFollow = (follow: boolean) => {
    if (userDetails !== null) {
      void fetch(`/api/users/${userDetails.id}/followers`, {
        method: follow ? 'POST' : 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          followerId: auth.user.isAnonymous ? null : auth.user.id,
        }),
      });
      setIsFollowing(follow);
    }
  };

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
              {!auth.user.isAnonymous && !userDetails.isSelf && (
                <>
                  {isFollowing ? (
                    <Tooltip title={<>Following &ndash; click to unfollow</>}>
                      <IconButton onClick={() => onFollow(false)}>
                        <AddCircleIcon color="primary" />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Tooltip title={<>Not following &ndash; click to follow</>}>
                      <IconButton onClick={() => onFollow(true)}>
                        <AddCircleOutlineIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </>
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
            {!auth.user.isAnonymous && userDetails.isSelf && (
              <Stack component="form" spacing={3} onSubmit={form.onSubmit}>
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
                <Divider />
              </Stack>
            )}
            <Typography variant="h5" display="flex" alignItems="center">
              <PersonPinIcon />
              <ArrowRightIcon />
              Following
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {userDetails?.following?.map((u) => (
                <Chip
                  key={u.id}
                  label={u.name}
                  onClick={() => {
                    if (
                      thisUser !== null &&
                      thisUser.id === u.id &&
                      !auth.user.isAnonymous
                    ) {
                      void router.push(`/profile/${auth.user.id}`);
                    } else {
                      void router.push(`/profile/${u.id}`);
                    }
                  }}
                />
              ))}
            </Box>
            <Divider />
            <Typography variant="h5" display="flex" alignItems="center">
              <PersonPinIcon />
              <ArrowLeftIcon />
              Followers
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {userDetails?.followers?.map((u) => (
                <Chip
                  key={u.id}
                  label={u.name}
                  onClick={() => {
                    if (
                      thisUser !== null &&
                      thisUser.id === u.id &&
                      !auth.user.isAnonymous
                    ) {
                      void router.push(`/profile/${auth.user.id}`);
                    } else {
                      void router.push(`/profile/${u.id}`);
                    }
                  }}
                />
              ))}
            </Box>
            <Divider />
            <Typography variant="h5" display="flex" alignItems="center" gap={3}>
              <FavoriteIcon />
              Favorites
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {userDetails?.favorites?.map((u) => (
                <Chip
                  key={u.fdcId}
                  label={u.name}
                  variant="outlined"
                  onClick={() => {
                    void router.push(`/details?id=${u.fdcId}`);
                  }}
                />
              ))}
            </Box>
            <Divider />
            {userDetails?.role === 'nutritionist' && (
              <>
                <Typography
                  variant="h5"
                  display="flex"
                  alignItems="center"
                  gap={3}
                >
                  <ThumbUpIcon />
                  Recommendations
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {userDetails?.reviews
                    ?.filter((r) => r.good)
                    .map((u) => (
                      <Chip
                        key={u.fdcId}
                        label={u.name}
                        variant="outlined"
                        onClick={() => {
                          void router.push(`/details?id=${u.fdcId}`);
                        }}
                      />
                    ))}
                </Box>
                <Divider />
                <Typography
                  variant="h5"
                  display="flex"
                  alignItems="center"
                  gap={3}
                >
                  <ThumbDownIcon />
                  Disapprovals
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {userDetails?.reviews
                    ?.filter((r) => !r.good)
                    .map((u) => (
                      <Chip
                        key={u.fdcId}
                        label={u.name}
                        variant="outlined"
                        onClick={() => {
                          void router.push(`/details?id=${u.fdcId}`);
                        }}
                      />
                    ))}
                </Box>
                <Divider />
              </>
            )}
          </Stack>
        )}
      </Container>
    </Layout>
  );
};

export default Details;
