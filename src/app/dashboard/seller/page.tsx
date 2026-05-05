import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { signOutAction } from "@/app/actions";

export default async function SellerDashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "seller") redirect("/dashboard");

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold">Seller dashboard</h1>
            <span className="text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-full px-2 py-0.5">
              seller
            </span>
          </div>
          <form action={signOutAction}>
            <button
              type="submit"
              className="text-sm text-gray-700 hover:text-black border border-gray-300 rounded-md px-3 py-1.5"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-10 space-y-6">
        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <p className="text-sm text-gray-500">Signed in as</p>
          <p className="text-lg font-medium">{user.name ?? user.email}</p>
          <p className="text-sm text-gray-600">{user.email}</p>
        </div>

        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-2">Seller tools</h2>
          <p className="text-sm text-gray-600 mb-4">Manage your store and listings.</p>
          <ul className="text-sm space-y-1 text-gray-700 list-disc list-inside">
            <li>Add new product</li>
            <li>View orders</li>
            <li>Payouts &amp; analytics</li>
          </ul>
        </div>
      </section>
    </main>
  );
}

