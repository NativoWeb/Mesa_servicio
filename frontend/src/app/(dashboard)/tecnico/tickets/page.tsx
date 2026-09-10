'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function TecnicoTicketsPage() {
  const router = useRouter();
  useEffect(() => { router.replace('/tecnico'); }, [router]);
  return null;
}
