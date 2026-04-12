export default function MatematikaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-full bg-gradient-to-b from-sky-50 via-violet-50/40 to-pink-50">
      {children}
    </div>
  );
}
