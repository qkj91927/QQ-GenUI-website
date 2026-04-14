import { Suspense } from "react";
import { CasesPage } from "@/components/site/cases-page";

export default function Page() {
  return (
    <Suspense>
      <CasesPage />
    </Suspense>
  );
}
