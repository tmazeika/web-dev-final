import CircularProgress from '@mui/material/CircularProgress';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import type { NextPage } from 'next';
import Layout from '../components/Layout';
import useSearchResults from '../hooks/useSearchResults';

const Search: NextPage = () => {
  const [results, loading] = useSearchResults();

  return (
    <Layout>
      {loading && <CircularProgress />}
      {!loading && (
        <List>
          {results.map((result) => (
            <ListItem key={result.id}>
              <ListItemText primary={result.description} />
            </ListItem>
          ))}
        </List>
      )}
    </Layout>
  );
};

export default Search;
