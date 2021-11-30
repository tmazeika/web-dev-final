import { useCallback, useState } from 'react';

export default function useLocalBooleanStorage(
  key: string,
  initialValue: boolean,
): readonly [boolean, (v: boolean) => void] {
  const [value, setValue] = useState(() => {
    if (typeof window !== 'undefined') {
      return (
        String(window.localStorage.getItem(key) ?? initialValue) === 'true'
      );
    }
    return initialValue;
  });

  const setStoredValue = useCallback(
    (v: boolean) => {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, String(v));
      }
      setValue(v);
    },
    [key, setValue],
  );

  return [value, setStoredValue];
}
