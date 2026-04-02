type FormulaBoxProps = {
  children: React.ReactNode;
  className?: string;
};

export function FormulaBox({ children, className = "" }: FormulaBoxProps) {
  return (
    <div
      className={`rounded-xl border border-cyan-500/40 bg-gradient-to-br from-cyan-500/10 to-emerald-500/10 px-4 py-3 font-mono text-sm text-slate-100 shadow-[0_0_24px_rgba(34,211,238,0.12)] sm:text-base ${className}`}
    >
      {children}
    </div>
  );
}
