import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export function useAuth(redirectTo = '/auth/signin') {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push(redirectTo);
    }
  }, [session, status, router, redirectTo]);

  return { session, status };
}
