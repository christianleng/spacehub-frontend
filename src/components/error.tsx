"use client";

type ErrorProps = {
  error: Error | string;
};

export default function CustomErrorComponent({ error }: ErrorProps) {
  const message = typeof error === "string" ? error : error.message;

  return (
    <div className="rounded-md border border-red-300 bg-red-50 p-4 text-red-700 shadow-sm">
      <h2 className="font-semibold">Une erreur est survenue</h2>
      <p className="text-sm">{message}</p>
    </div>
  );
}
