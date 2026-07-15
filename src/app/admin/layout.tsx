import { requireAdminProfile } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdminProfile();
  return <>{children}</>;
}
