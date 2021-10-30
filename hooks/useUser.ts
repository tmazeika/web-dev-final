import { useMemo } from 'react';

type UserHook =
  | {
      isAnonymous: false;
      name: string;
    }
  | {
      isAnonymous: true;
    };

export default function useUser(): UserHook {
  return useMemo(
    () => ({
      isAnonymous: true,
    }),
    [],
  );
}
