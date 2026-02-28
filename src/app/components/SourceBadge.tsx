import { Source, SOURCE_LABELS } from "@/app/lib/types";

const SOURCE_COLORS: Record<Source, string> = {
  "hacker-news":
    "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  reddit: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  "hatena-bookmark":
    "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  zenn: "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300",
  devto: "bg-zinc-200 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-300",
  lobsters:
    "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300",
  tldr: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  "aws-whatsnew":
    "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
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
