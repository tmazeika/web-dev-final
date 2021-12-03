import { useEffect, useState } from 'react';
import useAuth from './useAuth';
import useSignal from './useSignal';

export default function useIsFavorite(
  fdcId: string | null,
): [boolean, boolean] {
  const signal = useSignal();
  const auth = useAuth();
  const userId = auth.user.isAnonymous ? null : auth.user.id;
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userId !== null && fdcId !== null) {
      setLoading(true);
      fetch(`/api/users/${userId}/favorites/${fdcId}`, {
        signal,
      })
        .then((res) => res.json())
        .then((res: { isFavorite: boolean }) => {
          setIsFavorite(res.isFavorite);
        })
        .catch(console.error)
        .finally(() => {
          setLoading(false);
        });
    }
  }, [userId, fdcId, signal]);

  return [isFavorite, loading];
}
