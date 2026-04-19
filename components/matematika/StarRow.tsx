export function StarRow({ count, max = 3 }: { count: number; max?: number }) {
  const n = Math.min(max, Math.max(0, Math.round(count)));
  return (
    <span className="inline-flex gap-0.5" aria-label={`${n} z ${max} hvězd`}>
      {Array.from({ length: max }, (_, i) => (
        <span
          key={i}
          className={
            i < n ? "text-app-accent drop-shadow-sm" : "text-app-subtle"
          }
          aria-hidden
        >
          ★
        </span>
      ))}
    </span>
  );
}
