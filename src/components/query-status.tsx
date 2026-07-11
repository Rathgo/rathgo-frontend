import { AlertCircle } from "lucide-react";

export function LoadingBlock({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="grid place-items-center py-16 text-sm text-muted-foreground">
      <div className="h-6 w-6 rounded-full border-2 border-brand border-t-transparent animate-spin" />
      <p className="mt-3">{label}</p>
    </div>
  );
}

export function ErrorBlock({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
  const message = error instanceof Error ? error.message : "Something went wrong";
  return (
    <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-6 text-center">
      <AlertCircle className="h-6 w-6 text-destructive mx-auto" />
      <p className="mt-3 text-sm">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-brand mt-4">
          Retry
        </button>
      )}
    </div>
  );
}
