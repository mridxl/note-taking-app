"use client";
import { useSearchParams } from "next/navigation";

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const errorMessage = searchParams.get("message");

  return (
    <p>
      Sorry,
      {errorMessage ?? "An error occurred. Please try again later."}
    </p>
  );
}
