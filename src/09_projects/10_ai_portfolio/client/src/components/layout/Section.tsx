import type { ReactNode } from "react";

export default function Section({ children }: { children?: ReactNode }) {
  return (
    <section className="h-[100dvh] w-full grow flex flex-col relative">
      {children}
    </section>
  );
}
