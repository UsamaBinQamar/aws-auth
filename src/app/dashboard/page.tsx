import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { signOutAction } from "@/app/actions";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold">Dashboard</h1>
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

      <section className="max-w-4xl mx-auto px-6 py-10">
        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <p className="text-sm text-gray-500">Signed in as</p>
          <p className="text-lg font-medium">{user.name ?? user.email}</p>
          <p className="text-sm text-gray-600">{user.email}</p>

          <pre className="mt-6 text-xs bg-gray-900 text-gray-100 rounded-md p-4 overflow-auto">
            {JSON.stringify(user.claims, null, 2)}
          </pre>
        </div>
      </section>
    </main>
  );
}

