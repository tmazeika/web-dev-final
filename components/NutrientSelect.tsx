import Chip from '@mui/material/Chip';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import type { SelectChangeEvent } from '@mui/material/Select';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import type { Theme } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import type { FC } from 'react';
import React from 'react';

const getStyles = (
  nutrient: string,
  nutrients: readonly string[],
  theme: Theme,
) => ({
  fontWeight: nutrients.includes(nutrient)
    ? theme.typography.fontWeightMedium
    : theme.typography.fontWeightRegular,
});

const NutrientSelect: FC<{
  nutrients: string[];
  selectedNutrients: string[];
  onChange(selectedNutrients: string[]): void;
}> = (props) => {
  const theme = useTheme();

  const onChange = (e: SelectChangeEvent<string[]>) => {
    const value = e.target.value;
    props.onChange(typeof value === 'string' ? value.split(',') : value);
  };

  return (
    <FormControl sx={{ width: 350 }}>
      <InputLabel id="nutrient-select-label">Show nutrients</InputLabel>
      <Select
        labelId="nutrient-select-label"
        multiple
        value={props.selectedNutrients}
        onChange={onChange}
        input={<OutlinedInput label="Show nutrients" />}
        renderValue={(selected) => (
          <Stack direction="row" gap={0.5} flexWrap="wrap">
            {selected.map((value) => (
              <Chip key={value} label={value} size="small" />
            ))}
          </Stack>
        )}
      >
        {props.nutrients.map((nutrient) => (
          <MenuItem
            key={nutrient}
            value={nutrient}
            style={getStyles(nutrient, props.selectedNutrients, theme)}
          >
            {nutrient}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default NutrientSelect;
