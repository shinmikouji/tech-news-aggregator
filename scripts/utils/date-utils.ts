import path from "node:path";

const DATA_DIR = path.resolve(__dirname, "../../data");

/** Returns today's date in JST as YYYY-MM-DD */
export function getToday(): string {
  return new Date()
    .toLocaleDateString("en-CA", { timeZone: "Asia/Tokyo" })
    // en-CA gives YYYY-MM-DD format
    .replace(/\//g, "-");
}

/** Format a YYYY-MM-DD date for display (e.g. "March 1, 2026") */
export function formatDate(date: string): string {
  const d = new Date(`${date}T00:00:00+09:00`);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Tokyo",
  });
}

/** Returns the file path for a date's data JSON file */
export function getDataPath(date: string): string {
  return path.join(DATA_DIR, `${date}.json`);
}
