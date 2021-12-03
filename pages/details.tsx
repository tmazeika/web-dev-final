import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import Backdrop from '@mui/material/Backdrop';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import type { FdcFoodUsers } from '../api/dbModels';
import Layout from '../components/Layout';
import NutritionLabel from '../components/NutritionLabel';
import useAuth from '../hooks/useAuth';
import useDetailsId from '../hooks/useDetailsId';
import useDetailsResult from '../hooks/useDetailsResult';
import useIsNutritionist from '../hooks/useIsNutritionist';
import { pluralize } from '../util/lang';

const SearchText = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
}));

const Details: NextPage = () => {
  const [details, loading] = useDetailsResult();
  const router = useRouter();
  const auth = useAuth();
  const fdcId = useDetailsId();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isRatedGood, setIsRatedGood] = useState(false);
  const [isRatedBad, setIsRatedBad] = useState(false);
  const [favoriteCountMod, setFavoriteCountMod] = useState(0);
  const [goodCountMod, setGoodCountMod] = useState(0);
  const [badCountMod, setBadCountMod] = useState(0);
  const isNutritionist = useIsNutritionist();
  const [expandedUsers, setExpandedUsers] = useState<FdcFoodUsers>({
    favorites: [],
    good: [],
    bad: [],
  });
  const [expandedType, setExpandedType] = useState<
    'bad' | 'favorites' | 'good'
  >();

  useEffect(() => {
    if (fdcId !== null) {
      void fetch(`/api/fdc/${fdcId}`)
        .then((res) => res.json())
        .then((res: FdcFoodUsers) => setExpandedUsers(res));
    }
  }, [expandedType, fdcId]);

  useEffect(() => {
    if (auth.user.isAnonymous) {
      setIsFavorite(false);
      setIsRatedGood(false);
      setIsRatedBad(false);
    } else if (fdcId !== null) {
      void fetch(`/api/users/${auth.user.id}/favorites/${fdcId}`)
        .then((res) => res.json())
        .then((res: { isFavorite: boolean }) => {
          setIsFavorite(res.isFavorite);
        });
      void fetch(`/api/users/${auth.user.id}/reviews/${fdcId}`)
        .then((res) => res.json())
        .then((res: { good: boolean | null }) => {
          if (res.good === true) {
            setIsRatedGood(true);
            setIsRatedBad(false);
          } else if (res.good === false) {
            setIsRatedGood(false);
            setIsRatedBad(true);
          } else {
            setIsRatedGood(false);
            setIsRatedBad(false);
          }
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

  const onRate = async (good: boolean | null) => {
    if (!auth.user.isAnonymous && fdcId !== null) {
      await fetch(`/api/users/${auth.user.id}/reviews`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fdcId, good }),
      });
      if (isRatedGood) {
        setGoodCountMod((n) => n - 1);
      } else if (isRatedBad) {
        setBadCountMod((n) => n - 1);
      }
      if (good === true) {
        setGoodCountMod((n) => n + 1);
      }
      if (good === false) {
        setBadCountMod((n) => n + 1);
      }
      setIsRatedGood(good === true);
      setIsRatedBad(good === false);
    }
  };

  const onToggleExpanded = (t: 'bad' | 'favorites' | 'good') => {
    if (expandedType === t) {
      setExpandedType(undefined);
    } else {
      setExpandedType(t);
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
              <Stack direction="row" spacing={3}>
                <Typography display="flex" alignItems="center">
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
                  <Button
                    size="small"
                    variant="text"
                    color="inherit"
                    onClick={() => onToggleExpanded('favorites')}
                  >
                    {pluralize(
                      details.favorites + favoriteCountMod,
                      'favorite',
                      'favorites',
                    )}
                  </Button>
                </Typography>
                <Typography display="flex" alignItems="center">
                  {auth.user.isAnonymous || !isNutritionist ? (
                    <Tooltip title="You must be logged in as a nutritionist to review foods">
                      <IconButton>
                        <ThumbUpOutlinedIcon />
                      </IconButton>
                    </Tooltip>
                  ) : isRatedGood ? (
                    <IconButton onClick={() => onRate(null)}>
                      <ThumbUpIcon color="success" />
                    </IconButton>
                  ) : (
                    <IconButton onClick={() => onRate(true)}>
                      <ThumbUpOutlinedIcon />
                    </IconButton>
                  )}
                  <Button
                    size="small"
                    variant="text"
                    color="inherit"
                    onClick={() => onToggleExpanded('good')}
                  >
                    {pluralize(
                      details.goodReviews + goodCountMod,
                      'recommendation',
                      'recommendations',
                    )}
                  </Button>
                </Typography>
                <Typography display="flex" alignItems="center">
                  {auth.user.isAnonymous || !isNutritionist ? (
                    <Tooltip title="You must be logged in as a nutritionist to review foods">
                      <IconButton>
                        <ThumbDownOutlinedIcon />
                      </IconButton>
                    </Tooltip>
                  ) : isRatedBad ? (
                    <IconButton onClick={() => onRate(null)}>
                      <ThumbDownIcon color="error" />
                    </IconButton>
                  ) : (
                    <IconButton onClick={() => onRate(false)}>
                      <ThumbDownOutlinedIcon />
                    </IconButton>
                  )}
                  <Button
                    size="small"
                    variant="text"
                    color="inherit"
                    onClick={() => onToggleExpanded('bad')}
                  >
                    {pluralize(
                      details.badReviews + badCountMod,
                      'disapproval',
                      'disapprovals',
                    )}
                  </Button>
                </Typography>
              </Stack>
              <Divider />
              {expandedType !== undefined && (
                <>
                  <Typography variant="subtitle2">
                    Users that{' '}
                    {expandedType === 'favorites'
                      ? 'favor'
                      : expandedType === 'good'
                      ? 'recommend'
                      : 'disapprove of'}{' '}
                    this food item:
                  </Typography>
                  {expandedUsers[expandedType].length === 0 ? (
                    <Typography variant="subtitle2" color={'secondary'}>
                      Nobody yet... be the first!
                    </Typography>
                  ) : (
                    <Grid container spacing={1}>
                      {expandedUsers[expandedType].map((u) => (
                        <Grid key={u.userId} item xs={3}>
                          <Chip
                            label={u.name}
                            onClick={() => {
                              void router.push(`/profile/${u.userId}`);
                            }}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  )}
                  <Divider />
                </>
              )}
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
