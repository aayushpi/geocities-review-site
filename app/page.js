import { Suspense } from 'react';
import ReviewApp from './components/ReviewApp';

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReviewApp />
    </Suspense>
  );
}
