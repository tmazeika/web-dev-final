import { FirebaseError } from '@firebase/util';
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { useEffect, useState } from 'react';

interface AuthHook {
  user:
    | {
        isAnonymous: false;
        id: string;
        name: string;
      }
    | {
        isAnonymous: true;
      };

  register(email: string, password: string): Promise<string>;

  logIn(email: string, password: string): Promise<string>;

  logOut(): Promise<void>;
}

const auth = getAuth();

export default function useAuth(): AuthHook {
  const [info, setInfo] = useState<AuthHook>({
    user: {
      isAnonymous: true,
    },
    register(email: string, password: string): Promise<string> {
      return createUserWithEmailAndPassword(auth, email, password)
        .then(({ user }) => user.uid)
        .catch((err) => {
          if (err instanceof FirebaseError) {
            console.warn(err.message);
          }
          throw err;
        });
    },
    logIn(email: string, password: string): Promise<string> {
      return signInWithEmailAndPassword(auth, email, password)
        .then(({ user }) => user.uid)
        .catch((err) => {
          if (err instanceof FirebaseError) {
            console.warn(err.message);
          }
          throw err;
        });
    },
    logOut(): Promise<void> {
      return signOut(auth);
    },
  });

  useEffect(
    () =>
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setInfo((info) => ({
            ...info,
            user: {
              isAnonymous: false,
              id: user.uid,
              name: user.email ?? '',
            },
          }));
        } else {
          setInfo((info) => ({
            ...info,
            user: {
              isAnonymous: true,
            },
          }));
        }
      }),
    [],
  );

  return info;
}
