import { useEffect, useState } from 'react';
import type { FdcDetailsResponse } from '../types/fdcDetailsResponse';
import useDetailsId from './useDetailsId';
import useSignal from './useSignal';

export default function useDetailsResult(): [
  FdcDetailsResponse | null,
  boolean,
] {
  const signal = useSignal();
  const id = useDetailsId();
  const [details, setDetails] = useState<FdcDetailsResponse>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id !== null) {
      setLoading(true);
      fetch(
        `/api/fdc/details?${new URLSearchParams({
          id,
        }).toString()}`,
        {
          signal,
        },
      )
        .then((res) => res.json())
        .then((res: FdcDetailsResponse) => {
          setDetails(res);
        })
        .catch(console.error)
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id, signal]);

  return [details ?? null, loading];
}
