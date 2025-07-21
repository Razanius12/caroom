'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="content">
      <div className="container text-center my-5">
        <h2>Something went wrong!</h2>
        <button
          className="btn btn-info mt-3"
          onClick={() => reset()}
        >
          Try again
        </button>
      </div>
    </div>
  );
}