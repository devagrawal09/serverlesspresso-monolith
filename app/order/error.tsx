"use client";

import { useEffect } from "react";

export default function OrderError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.log({ error });
  }, [error]);

  return (
    <div className="flex flex-col gap-2">
      <h2>{error.message}</h2>
      <button
        onClick={reset}
        className="bg-blue-400 hover:bg-blue-700 text-white font-bold py-2 px-4"
      >
        Try again
      </button>
    </div>
  );
}
