import { useEffect, useState } from 'react';
import type { FdcSearchResponse } from '../types/fdcSearchResponse';
import useSearchQuery from './useSearchQuery';
import useSignal from './useSignal';

export default function useSearchResults(): [
  FdcSearchResponse | null,
  boolean,
] {
  const signal = useSignal();
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
        {
          signal,
        },
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
  }, [query, signal]);

  return [results ?? null, loading];
}
