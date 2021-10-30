import { useEffect, useState } from 'react';
import type { FdcFoodSummary } from '../types/fdcFoodSummary';
import type { FdcSearchResponse } from '../types/fdcSearchResponse';
import useSearchQuery from './useSearchQuery';
import useSignal from './useSignal';

export default function useSearchResults(): [FdcFoodSummary[], boolean] {
  const signal = useSignal();
  const query = useSearchQuery();
  const [results, setResults] = useState<FdcFoodSummary[]>([]);
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
          setResults(res.results);
        })
        .catch((e) => {
          console.error(e);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [query, signal]);

  return [results, loading];
}
