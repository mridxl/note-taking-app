export default function NotFound() {
  return (
    <div className="flex h-[calc(100svh-4.5rem)] flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
      <p className="mt-4">
        Sorry, the page you are looking for does not exist.
      </p>
      <a href="/" className="mt-6 underline underline-offset-4">
        Go back to Home
      </a>
    </div>
  );
}
