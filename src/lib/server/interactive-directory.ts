import { aaseAtlas } from "./aase-interactive.ts";
import { interactiveCatalog } from "./interactive.ts";
import type { Locale } from "../model.ts";

export function directory(lang: Locale) {
  const atlas = aaseAtlas(lang);
  return [
    ...interactiveCatalog.summaries.map((lesson) => ({
      id: lesson.id,
      title: lang === "zh" ? "網路基礎" : "Networking",
      href: lesson.href[lang],
      items: [{ title: lesson.title[lang], href: lesson.href[lang] }],
    })),
    ...atlas.map((chapter) => ({
      id: chapter.id,
      title: chapter.title,
      href: chapter.href,
      items: chapter.concepts.map((c) => ({
        title: c.title[lang],
        href: c.href,
      })),
    })),
  ];
}
