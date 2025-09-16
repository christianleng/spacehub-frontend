"use client";

type EmptyStateProps = {
  message?: string;
};

export default function CustomEmptyStateComponent({
  message = "Aucune donnée trouvée.",
}: EmptyStateProps) {
  return (
    <div className="rounded-md border border-dashed border-gray-300 p-6 text-center text-gray-500">
      <p className="text-sm">{message}</p>
    </div>
  );
}
