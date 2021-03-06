import Backdrop from '@mui/material/Backdrop';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import MuiLink from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import type { NextPage } from 'next';
import Link from 'next/link';
import React, { useState } from 'react';
import { PAGE_SIZE } from '../apiUtils/fdcApi';
import Layout from '../components/Layout';
import NutrientSelect from '../components/NutrientSelect';
import useSearchQuery from '../hooks/useSearchQuery';
import useSearchResults from '../hooks/useSearchResults';
import { formatFloat, formatInt, pluralize } from '../util/lang';

const SearchText = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
})).withComponent('span');

const Search: NextPage = () => {
  const query = useSearchQuery();
  const [results, loading] = useSearchResults();
  const [showNutrients, setShowNutrients] = useState<string[]>([
    'Protein',
    'Fiber',
    'Fat',
    'Carbs',
    'Sugar',
  ]);

  return (
    <Layout>
      <Container maxWidth="md">
        <Stack py={5}>
          <Backdrop open={loading}>
            <CircularProgress color="inherit" />
          </Backdrop>
          {loading && (
            <Stack spacing={1}>
              <Skeleton variant="text" animation="wave" />
              <Skeleton variant="text" animation="wave" />
            </Stack>
          )}
          {!loading && results && (
            <>
              <Stack direction="row">
                <Stack flexGrow={1}>
                  <Typography variant="h6">
                    Search results for <SearchText>{query}</SearchText>
                  </Typography>
                  <Typography variant="caption">
                    {pluralize(results.count, 'match', 'matches')}
                  </Typography>
                </Stack>
                <NutrientSelect
                  nutrients={['Protein', 'Fiber', 'Fat', 'Carbs', 'Sugar']}
                  selectedNutrients={showNutrients}
                  onChange={setShowNutrients}
                />
              </Stack>
              <Stack spacing={3}>
                <List>
                  {results.results.map((food) => (
                    <React.Fragment key={food.id}>
                      <ListItem>
                        <ListItemText
                          primary={
                            <Link href={`/details?id=${food.id}`} passHref>
                              <MuiLink
                                variant="h5"
                                color="inherit"
                                underline="none"
                              >
                                {food.description}
                              </MuiLink>
                            </Link>
                          }
                          secondary={
                            <>
                              Serving:{' '}
                              {food.portionName !== null ? (
                                <>
                                  <strong>{food.portionName}</strong> (
                                  {formatInt(food.portionGrams)}&#8202;g)
                                </>
                              ) : (
                                <>
                                  <strong>
                                    {formatInt(food.portionGrams)}&#8202;g
                                  </strong>
                                </>
                              )}
                              <Stack
                                component="span"
                                direction="row"
                                spacing={1}
                                mt={1}
                              >
                                <Chip
                                  component="span"
                                  variant="outlined"
                                  size="small"
                                  color="primary"
                                  label={
                                    <>{formatInt(food.calories)}&#8198;kcal</>
                                  }
                                />
                                {showNutrients.includes('Protein') && (
                                  <Chip
                                    component="span"
                                    variant="outlined"
                                    size="small"
                                    label={
                                      <>
                                        {formatFloat(food.protein)}&#8202;g
                                        protein
                                      </>
                                    }
                                  />
                                )}
                                {showNutrients.includes('Fiber') && (
                                  <Chip
                                    component="span"
                                    variant="outlined"
                                    size="small"
                                    label={
                                      <>
                                        {formatFloat(food.fiber)}&#8202;g fiber
                                      </>
                                    }
                                  />
                                )}
                                {showNutrients.includes('Fat') && (
                                  <Chip
                                    component="span"
                                    variant="outlined"
                                    size="small"
                                    label={
                                      <>{formatFloat(food.fat)}&#8202;g fat</>
                                    }
                                  />
                                )}
                                {showNutrients.includes('Carbs') && (
                                  <Chip
                                    component="span"
                                    variant="outlined"
                                    size="small"
                                    label={
                                      <>
                                        {formatFloat(food.carbs)}&#8202;g carbs
                                      </>
                                    }
                                  />
                                )}
                                {showNutrients.includes('Sugar') && (
                                  <Chip
                                    component="span"
                                    variant="outlined"
                                    size="small"
                                    label={
                                      <>
                                        {formatFloat(food.sugar)}&#8202;g sugar
                                      </>
                                    }
                                  />
                                )}
                              </Stack>
                            </>
                          }
                        />
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))}
                </List>
                {results.count > PAGE_SIZE && (
                  <Typography variant="caption">
                    {pluralize(results.count - PAGE_SIZE, 'match', 'matches')}{' '}
                    not shown
                  </Typography>
                )}
              </Stack>
            </>
          )}
        </Stack>
      </Container>
    </Layout>
  );
};

export default Search;
