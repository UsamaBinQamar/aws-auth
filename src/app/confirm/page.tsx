"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { confirmAction, resendCodeAction } from "@/app/actions";

function ConfirmForm() {
  const params = useSearchParams();
  const email = params.get("email") ?? "";
  const [state, formAction, pending] = useActionState(confirmAction, undefined);

  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-sm border p-8">
      <h1 className="text-2xl font-semibold mb-1">Confirm your email</h1>
      <p className="text-sm text-gray-500 mb-6">
        Enter the 6-digit code we sent to <span className="font-medium">{email || "your email"}</span>.
      </p>

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="email" value={email} />
        <label className="block">
          <span className="block text-sm font-medium text-gray-700 mb-1">Verification code</span>
          <input
            name="code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            required
            maxLength={6}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm tracking-widest text-center text-lg focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black"
          />
        </label>

        {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="w-full bg-black text-white rounded-md py-2.5 text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
        >
          {pending ? "Verifying…" : "Confirm"}
        </button>
      </form>

      <form action={resendCodeAction} className="mt-4">
        <input type="hidden" name="email" value={email} />
        <button type="submit" className="text-sm text-blue-600 hover:underline">
          Resend code
        </button>
      </form>

      <p className="text-sm text-gray-600 mt-6 text-center">
        <Link href="/login" className="text-blue-600 hover:underline">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}

export default function ConfirmPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Suspense>
        <ConfirmForm />
      </Suspense>
    </main>
  );
}

