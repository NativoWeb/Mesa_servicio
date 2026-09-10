'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CuentadanteEquiposPage() {
  const router = useRouter();
  useEffect(() => { router.replace('/cuentadante'); }, [router]);
  return null;
}
