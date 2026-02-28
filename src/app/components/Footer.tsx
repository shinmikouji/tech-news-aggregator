export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 py-6 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-500">
      <div className="mx-auto max-w-5xl px-4">
        <p>Powered by GitHub Actions &middot; {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
}
