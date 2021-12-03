import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import type { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import NutritionLabel from '../components/NutritionLabel';
import useAuth from '../hooks/useAuth';
import useDetailsId from '../hooks/useDetailsId';
import useDetailsResult from '../hooks/useDetailsResult';
import { pluralize } from '../util/lang';

const SearchText = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
}));

const Details: NextPage = () => {
  const [details, loading] = useDetailsResult();
  const auth = useAuth();
  const fdcId = useDetailsId();
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteCountMod, setFavoriteCountMod] = useState(0);

  useEffect(() => {
    if (auth.user.isAnonymous) {
      setIsFavorite(false);
    } else if (fdcId !== null) {
      void fetch(`/api/users/${auth.user.id}/favorites/${fdcId}`)
        .then((res) => res.json())
        .then((res: { isFavorite: boolean }) => {
          setIsFavorite(res.isFavorite);
        });
    }
  }, [auth.user, fdcId]);

  const onFavorite = async (favorite: boolean) => {
    if (!auth.user.isAnonymous && fdcId !== null) {
      await fetch(`/api/users/${auth.user.id}/favorites`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fdcId, favorite }),
      });
      setIsFavorite(favorite);
      setFavoriteCountMod((n) => n + (favorite ? 1 : -1));
    }
  };

  return (
    <Layout>
      <Container maxWidth="sm">
        <Stack py={5} spacing={2}>
          <Backdrop open={loading}>
            <CircularProgress color="inherit" />
          </Backdrop>
          {loading && (
            <Stack spacing={1}>
              <Skeleton variant="text" animation="wave" />
              <Skeleton variant="text" animation="wave" />
            </Stack>
          )}
          {!loading && details && (
            <>
              <SearchText variant="h4">{details.description}</SearchText>
              <Typography display="flex" alignItems="center" gap={1}>
                {isFavorite ? (
                  <IconButton onClick={() => onFavorite(false)}>
                    <FavoriteIcon color="error" />
                  </IconButton>
                ) : (
                  <>
                    {auth.user.isAnonymous ? (
                      <Tooltip title="You must be logged in to favorite foods">
                        <IconButton>
                          <FavoriteBorderIcon />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <IconButton onClick={() => onFavorite(true)}>
                        <FavoriteBorderIcon />
                      </IconButton>
                    )}
                  </>
                )}
                {pluralize(
                  details.favorites + favoriteCountMod,
                  'favorite',
                  'favorites',
                )}
              </Typography>
              <Divider />
              <NutritionLabel
                portions={details.portions}
                ingredients={details.ingredients}
                caloriesPerGram={details.caloriesPerGram}
                carbsPerGram={details.carbsPerGram}
                sugarPerGram={details.sugarPerGram}
                fatPerGram={details.fatPerGram}
                proteinPerGram={details.proteinPerGram}
                fiberPerGram={details.fiberPerGram}
              />
            </>
          )}
        </Stack>
      </Container>
    </Layout>
  );
};

export default Details;
