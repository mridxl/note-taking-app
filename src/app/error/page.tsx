export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
      <p className="mt-4">
        Sorry, an unexpected error has occurred. Please try again later.
      </p>
      <a href="/" className="mt-6 underline underline-offset-4">
        Go back to Home
      </a>
    </div>
  );
}
