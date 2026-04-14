import { Suspense } from "react";
import { CheatsheetPage } from "@/components/site/cheatsheet-page";

export default function Page() {
  return (
    <Suspense>
      <CheatsheetPage />
    </Suspense>
  );
}
