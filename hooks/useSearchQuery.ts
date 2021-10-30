import { useRouter } from 'next/router';

export default function useSearchQuery(): string | null {
  const router = useRouter();
  return typeof router.query.q === 'string' ? router.query.q.trim() : null;
}
