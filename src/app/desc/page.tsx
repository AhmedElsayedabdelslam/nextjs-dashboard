'use client'

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function DescPageContent() {
  const searchParams = useSearchParams();
  const myParam = searchParams.get('id'); // مثال
  return <div>Param: {myParam}</div>;
}

export default function DescPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DescPageContent />
    </Suspense>
  );
}
