import { useEffect, useState } from 'react';
import useAuth from './useAuth';

export default function useIsFavorite(
  fdcId: string | null,
): [boolean, boolean] {
  const auth = useAuth();
  const userId = auth.user.isAnonymous ? null : auth.user.id;
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userId !== null && fdcId !== null) {
      setLoading(true);
      fetch(`/api/users/${userId}/favorites/${fdcId}`)
        .then((res) => res.json())
        .then((res: { isFavorite: boolean }) => {
          setIsFavorite(res.isFavorite);
        })
        .catch(console.error)
        .finally(() => {
          setLoading(false);
        });
    }
  }, [userId, fdcId]);

  return [isFavorite, loading];
}
