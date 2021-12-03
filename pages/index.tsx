import FavoriteIcon from '@mui/icons-material/FavoriteTwoTone';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { NextPage } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import type { FdcFood } from '../apiUtils/dbModels';
import Layout from '../components/Layout';
import PrivacyPolicyAlert from '../components/PrivacyPolicyAlert';
import useAuth from '../hooks/useAuth';
import foodCollage from '../public/food_collage.jpg';
import { pluralize } from '../util/lang';

interface UserFdcFood {
  _id: string;
  fdcId: string;
  name: string;
}

const Home: NextPage = () => {
  const router = useRouter();
  const auth = useAuth();
  const [favorites, setFavorites] = useState<FdcFood[]>([]);
  const [userFavorites, setUserFavorites] = useState<UserFdcFood[]>([]);

  useEffect(() => {
    void fetch(`/api/favorites`)
      .then((res) => res.json())
      .then((res: FdcFood[]) => {
        setFavorites(res);
      });
  }, []);

  useEffect(() => {
    if (!auth.user.isAnonymous) {
      void fetch(`/api/users/${auth.user.id}/favorites`)
        .then((res) => res.json())
        .then((res: UserFdcFood[]) => {
          setUserFavorites(res);
        });
    }
  }, [auth.user]);

  return (
    <Layout>
      <Container maxWidth="md">
        <Stack py={5} spacing={5}>
          <PrivacyPolicyAlert />
          <Typography variant="h2">Welcome to Cookbook</Typography>
          <Typography variant="h5" lineHeight={1.6}>
            Cookbook is a place to find popular food items and recommended foods
            by nutritionists. Search for foods above and favorite your best
            dishes!
          </Typography>
        </Stack>
        <Typography variant="h5" color="primary">
          Top 10 Favorite Foods
        </Typography>
        <List>
          {favorites.map((food) => (
            <ListItemButton
              key={String(food._id)}
              onClick={() => {
                void router.push(`/details?id=${food.fdcId}`);
              }}
            >
              <ListItemIcon>
                <FavoriteIcon color="error" />
              </ListItemIcon>
              <ListItemText
                primary={food.name}
                secondary={pluralize(food.favorites, 'favorite', 'favorites')}
              />
            </ListItemButton>
          ))}
        </List>
        {!auth.user.isAnonymous && (
          <>
            <Typography variant="h5" color="primary">
              Your Favorite Foods
            </Typography>
            <List>
              {userFavorites.map((food) => (
                <ListItemButton
                  key={String(food._id)}
                  onClick={() => {
                    void router.push(`/details?id=${food.fdcId}`);
                  }}
                >
                  <ListItemIcon>
                    <FavoriteIcon color="error" />
                  </ListItemIcon>
                  <ListItemText primary={food.name} />
                </ListItemButton>
              ))}
            </List>
          </>
        )}
      </Container>
      <Box height="40em" position="relative" overflow="hidden" mt={5}>
        <Image
          src={foodCollage}
          alt="Food collage"
          layout="fill"
          objectFit="cover"
          objectPosition="left 75%"
          placeholder="blur"
          priority
        />
      </Box>
    </Layout>
  );
};

export default Home;
