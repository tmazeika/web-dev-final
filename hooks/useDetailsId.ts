import { useRouter } from 'next/router';

export default function useDetailsId(): string | null {
  const router = useRouter();
  return typeof router.query.id === 'string' ? router.query.id : null;
}
