import { Suspense } from "react";
import { AssetsPage } from "@/components/site/assets-page";

export default function Page() {
  return (
    <Suspense>
      <AssetsPage />
    </Suspense>
  );
}
