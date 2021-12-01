import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import type { NextPage } from 'next';
import React from 'react';
import Layout from '../components/Layout';
import NutritionLabel from '../components/NutritionLabel';
import useDetailsResult from '../hooks/useDetailsResult';

const SearchText = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
}));

const Details: NextPage = () => {
  const [details, loading] = useDetailsResult();

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
