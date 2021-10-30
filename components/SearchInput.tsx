import SearchIcon from '@mui/icons-material/Search';
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import { useRouter } from 'next/router';
import type { FC, SyntheticEvent } from 'react';
import { useEffect, useState } from 'react';
import useSearchQuery from '../hooks/useSearchQuery';

const SearchInput: FC = () => {
  const [value, setValue] = useState('');
  const disabled = value.trim() === '';
  const router = useRouter();
  // `true` if we're in the search page.
  const inSearch = router.route === '/search';
  const searchQuery = useSearchQuery();

  // This is non-null only when the router is ready, we're in the search page,
  // _and_ the search query is non-empty.
  const initialValue = (router.isReady && inSearch && searchQuery) || null;
  useEffect(() => {
    if (initialValue !== null) {
      setValue(initialValue);
    }
  }, [initialValue]);

  const onSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (!disabled) {
      void router.push({
        pathname: '/search',
        query: { q: value.trim() },
      });
    }
  };

  return (
    <Stack component="form" direction="row" spacing={1} onSubmit={onSubmit}>
      <Input
        type="text"
        placeholder="Search foods"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        startAdornment={
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        }
      />
      <Button type="submit" disabled={disabled}>
        Search
      </Button>
    </Stack>
  );
};

export default SearchInput;
