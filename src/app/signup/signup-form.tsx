"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signUpAction } from "@/app/actions";

export function SignupForm({
  role,
  title,
  subtitle,
}: {
  role: "seller" | "customer";
  title: string;
  subtitle: string;
}) {
  const [state, formAction, pending] = useActionState(signUpAction, undefined);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-sm border p-8">
        <span className="inline-block text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-full px-2 py-0.5 mb-3">
          {role === "seller" ? "Seller account" : "Customer account"}
        </span>
        <h1 className="text-2xl font-semibold mb-1">{title}</h1>
        <p className="text-sm text-gray-500 mb-6">{subtitle}</p>

        <form action={formAction} className="space-y-4">
          <input type="hidden" name="role" value={role} />
          <Field label="Name" name="name" type="text" required />
          <Field label="Email" name="email" type="email" required />
          <Field label="Password" name="password" type="password" required minLength={8} />

          {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

          <button
            type="submit"
            disabled={pending}
            className="w-full bg-black text-white rounded-md py-2.5 text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
          >
            {pending ? "Creating account…" : `Sign up as ${role}`}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600 space-y-2">
          <p>
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
          <p>
            <Link href="/signup" className="text-gray-500 hover:underline">
              ← Choose a different role
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

function Field(props: {
  label: string;
  name: string;
  type: string;
  required?: boolean;
  minLength?: number;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-gray-700 mb-1">{props.label}</span>
      <input
        name={props.name}
        type={props.type}
        required={props.required}
        minLength={props.minLength}
        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black"
      />
    </label>
  );
}

