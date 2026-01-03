export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center py-32 px-16 bg-white dark:bg-black">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-semibold text-black dark:text-zinc-50">
            404 - Page Not Found
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            The page you are looking for does not exist.
          </p>
          <a
            href="/"
            className="inline-block mt-6 px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Go to Homepage
          </a>
        </div>
      </main>
    </div>
  );
}

