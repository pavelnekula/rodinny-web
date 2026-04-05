import { AnglictinaGameLayout } from "@/components/tinuska/anglictina/AnglictinaGameLayout";

export default function AnglictinaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AnglictinaGameLayout>{children}</AnglictinaGameLayout>;
}
