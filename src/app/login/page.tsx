"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { signInAction } from "@/app/actions";

function LoginForm() {
  const params = useSearchParams();
  const justConfirmed = params.get("confirmed") === "1";
  const [state, formAction, pending] = useActionState(signInAction, undefined);

  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-sm border p-8">
      <h1 className="text-2xl font-semibold mb-1">Sign in</h1>
      <p className="text-sm text-gray-500 mb-6">Welcome back.</p>

      {justConfirmed && (
        <div className="mb-4 rounded-md bg-green-50 border border-green-200 px-3 py-2 text-sm text-green-800">
          Email confirmed. You can sign in now.
        </div>
      )}

      <form action={formAction} className="space-y-4">
        <label className="block">
          <span className="block text-sm font-medium text-gray-700 mb-1">Email</span>
          <input
            name="email"
            type="email"
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black"
          />
        </label>

        <label className="block">
          <span className="block text-sm font-medium text-gray-700 mb-1">Password</span>
          <input
            name="password"
            type="password"
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black"
          />
        </label>

        {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="w-full bg-black text-white rounded-md py-2.5 text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
        >
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="text-sm text-gray-600 mt-6 text-center">
        New here?{" "}
        <Link href="/signup" className="text-blue-600 hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  );
}

