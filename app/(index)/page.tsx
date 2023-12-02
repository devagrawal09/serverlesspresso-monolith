import { Suspense } from "react";

export const revalidate = 0;

import { FeedSkeleton } from "../components/feed";
import { Catalog } from "./catalog";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <h1 className="text-lg text-center">Streaming with Suspense</h1>
      <Suspense fallback={<FeedSkeleton />}>
        <Catalog />
      </Suspense>
      <p className="text-center mt-10">
        <Link href="/orders" className="hover:underline">
          Orders View
        </Link>
        {" | "}
        <Link href="/barista" className="hover:underline">
          Barista View
        </Link>
      </p>
    </>
  );
}
