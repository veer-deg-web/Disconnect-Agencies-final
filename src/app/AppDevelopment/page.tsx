import dynamic from "next/dynamic";
import { Suspense } from "react";

const AppDevelopmentClient = dynamic(
  () => import("./client"),
  { ssr: false }
);

export default function Page() {
  return (
    <Suspense fallback={null}>
      <AppDevelopmentClient />
      
    </Suspense>
  );
}