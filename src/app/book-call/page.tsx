import { Suspense } from "react";
import BookCallClient from "./BookCallClient";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <BookCallClient />
    </Suspense>
  );
}