import type { ReactNode } from "react";

export function LegalDoc({
  title,
  updated,
  intro,
  children,
}: {
  title: string;
  updated: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <div className="pt-16 lg:pt-20">
      <section className="py-16 bg-[#1F6BA0]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3">{title}</h1>
          <p className="text-white/70 text-sm">Last updated {updated}</p>
        </div>
      </section>
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <p className="text-gray-500 leading-relaxed mb-10">{intro}</p>
        <div className="space-y-9 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-gray-900 [&_h2]:mb-2 [&_p]:text-sm [&_p]:text-gray-600 [&_p]:leading-relaxed [&_li]:text-sm [&_li]:text-gray-600 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_ul]:mt-2 [&_a]:text-[#2D8FCE] [&_a]:underline">
          {children}
        </div>
      </article>
    </div>
  );
}
