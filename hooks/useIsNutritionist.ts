import { useEffect, useState } from 'react';
import useAuth from './useAuth';

export default function useIsNutritionist(): boolean {
  const auth = useAuth();
  const userId = auth.user.isAnonymous ? null : auth.user.id;
  const [isNutritionist, setIsNutritionist] = useState(false);

  useEffect(() => {
    if (userId !== null) {
      fetch(`/api/users/${userId}/role`)
        .then((res) => res.json())
        .then((res: { role: string }) => {
          setIsNutritionist(res.role === 'nutritionist');
        })
        .catch(console.error);
    }
  }, [userId]);

  return isNutritionist;
}
