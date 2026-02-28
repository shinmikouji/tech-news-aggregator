import { Source, SOURCE_LABELS } from "@/app/lib/types";

const SOURCE_COLORS: Record<Source, string> = {
  "hacker-news":
    "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  "hatena-bookmark":
    "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  zenn: "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300",
  devto: "bg-zinc-200 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-300",
  lobsters:
    "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300",
  publickey:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  qiita:
    "bg-lime-100 text-lime-800 dark:bg-lime-900/30 dark:text-lime-300",
  itmedia:
    "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300",
};

export default function SourceBadge({ source }: { source: Source }) {
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${SOURCE_COLORS[source]}`}
    >
      {SOURCE_LABELS[source]}
    </span>
  );
}
