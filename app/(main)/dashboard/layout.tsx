import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      <aside className="w-64 border-r p-6 space-y-6 hidden md:block">
        <h2 className="text-xl font-bold mb-8">Dashboard</h2>
        <nav className="flex flex-col gap-4">
          <Link href="/dashboard" className="hover:text-blue-600">
            Overview
          </Link>
          <Link href="/dashboard/my-ads" className="hover:text-blue-600">
            My Ads
          </Link>
          <Link href="/dashboard/saved-ads" className="hover:text-blue-600">
            Saved Ads
          </Link>
          <Link href="/dashboard/profile" className="hover:text-blue-600">
            Profile
          </Link>
          <Link
            href="/dashboard/post-ad"
            className="hover:text-blue-600 font-semibold"
          >
            + Post New Ad
          </Link>
        </nav>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
