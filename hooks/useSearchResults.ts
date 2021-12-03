import { useEffect, useState } from 'react';
import type { FdcSearchResponse } from '../types/fdcSearchResponse';
import useSearchQuery from './useSearchQuery';

export default function useSearchResults(): [
  FdcSearchResponse | null,
  boolean,
] {
  const query = useSearchQuery();
  const [results, setResults] = useState<FdcSearchResponse>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query !== null) {
      setLoading(true);
      fetch(
        `/api/fdc/search?${new URLSearchParams({
          q: query,
        }).toString()}`,
      )
        .then((res) => res.json())
        .then((res: FdcSearchResponse) => {
          setResults(res);
        })
        .catch(console.error)
        .finally(() => {
          setLoading(false);
        });
    }
  }, [query]);

  return [results ?? null, loading];
}
