'use client';

import { useEffect } from 'react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Barnx route error', error);
  }, [error]);

  return (
    <main className="page">
      <section className="pageHero" style={{ minHeight: '62vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <span className="eyebrow">TEMPORARY ERROR</span>
        <h1>This page could not load.</h1>
        <p>Your data has not been changed. Try the request again, or return to the homepage if the problem continues.</p>
        <div className="heroActions">
          <button className="button black" type="button" onClick={reset}>Try again</button>
          <a className="button" href="/">Back home</a>
        </div>
      </section>
    </main>
  );
}
