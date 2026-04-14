import { Suspense } from "react";
import { SkillsPage } from "@/components/site/skills-page";

export default function Page() {
  return (
    <Suspense>
      <SkillsPage />
    </Suspense>
  );
}
