import { useEffect, useState } from 'react';
import type { UserDetails } from '../apiUtils/dbModels';

export default function useUserDetails(id: string): UserDetails | null {
  const [details, setDetails] = useState<UserDetails>();

  useEffect(() => {
    if (id !== '') {
      fetch(`/api/users/${id}`)
        .then((res) => res.json())
        .then((res: UserDetails) => {
          setDetails(res);
        })
        .catch(console.error);
    }
  }, [id]);

  return details ?? null;
}
