import LinkIcon from '@mui/icons-material/Link';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import type { FdcIngredient, FdcPortion } from '../types/fdcDetailsResponse';
import { formatFloat } from '../util/lang';

const MutedText = styled('span')(({ theme }) => ({
  color: theme.palette.grey[500],
  marginLeft: theme.spacing(1),
}));

const NutritionLabel: FC<{
  portions: FdcPortion[];
  caloriesPerGram: number;
  carbsPerGram: number;
  sugarPerGram: number;
  fatPerGram: number;
  proteinPerGram: number;
  fiberPerGram: number;
  ingredients: FdcIngredient[];
}> = (props) => {
  const router = useRouter();
  const [portion, setPortion] = useState<FdcPortion>();

  const firstPortion: FdcPortion | undefined = props.portions[0];
  useEffect(() => {
    if (firstPortion !== undefined) {
      setPortion(firstPortion);
    }
  }, [firstPortion]);

  return (
    <Stack spacing={2} maxWidth="20em">
      <Typography variant="h4">Nutrition Facts</Typography>
      <FormControl>
        <InputLabel id="nutrition-label-serving-size">Serving size</InputLabel>
        {portion !== undefined && (
          <Select
            labelId="nutrition-label-serving-size"
            value={portion.id}
            label="Serving size"
            onChange={(e) =>
              setPortion(props.portions.find((p) => p.id === e.target.value))
            }
          >
            {props.portions.map((portion) => (
              <MenuItem key={portion.id} value={portion.id}>
                <Typography>
                  {portion.name}
                  <MutedText>{portion.grams}&#8198;g</MutedText>
                </Typography>
              </MenuItem>
            ))}
          </Select>
        )}
      </FormControl>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell align="right">Amount per serving</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell component="th" scope="row">
                Calories
              </TableCell>
              <TableCell align="right">
                {formatFloat(props.caloriesPerGram * (portion?.grams ?? 0))}
                &#8198;kcal
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                Protein
              </TableCell>
              <TableCell align="right">
                {formatFloat(props.proteinPerGram * (portion?.grams ?? 0))}
                &#8198;g
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                Fiber
              </TableCell>
              <TableCell align="right">
                {formatFloat(props.fiberPerGram * (portion?.grams ?? 0))}
                &#8198;g
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                Fat
              </TableCell>
              <TableCell align="right">
                {formatFloat(props.fatPerGram * (portion?.grams ?? 0))}
                &#8198;g
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                Carbohydrates
              </TableCell>
              <TableCell align="right">
                {formatFloat(props.carbsPerGram * (portion?.grams ?? 0))}
                &#8198;g
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                Sugar
              </TableCell>
              <TableCell align="right">
                {formatFloat(props.sugarPerGram * (portion?.grams ?? 0))}
                &#8198;g
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Typography variant="h4">Inputs</Typography>
      <List>
        {props.ingredients.map((ingredient) => (
          <React.Fragment key={ingredient.id}>
            {ingredient.fdcId !== null && (
              <ListItemButton
                onClick={() => {
                  void router.push(
                    `/details?id=${ingredient?.fdcId?.toString() ?? ''}`,
                  );
                }}
              >
                <ListItemText
                  primary={
                    <Stack direction="row" gap={1}>
                      {ingredient.name} <LinkIcon color="primary" />
                    </Stack>
                  }
                  secondary={ingredient.amount}
                />
              </ListItemButton>
            )}
            {ingredient.fdcId === null && (
              <ListItem>
                <ListItemText
                  primary={ingredient.name}
                  secondary={ingredient.amount}
                />
              </ListItem>
            )}
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </Stack>
  );
};

export default NutritionLabel;
