import Link from "next/link";
import { FyzikaHub } from "@/components/fyzika-teodor/FyzikaHub";

export default function FyzikaTeodorPage() {
  return (
    <div>
      <Link
        href="/"
        className="mb-8 inline-flex text-sm font-medium text-app-muted transition hover:text-app-accent"
      >
        ← Zpět na úvod
      </Link>
      <FyzikaHub />
    </div>
  );
}
