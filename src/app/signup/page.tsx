import Link from "next/link";

export default function SignupChooserPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-semibold text-center mb-2">Join us</h1>
        <p className="text-center text-gray-600 mb-8">How do you want to use the platform?</p>

        <div className="grid sm:grid-cols-2 gap-4">
          <Link
            href="/signup/customer"
            className="bg-white border rounded-lg p-6 hover:border-black hover:shadow-sm transition group"
          >
            <h2 className="text-xl font-semibold mb-2">I'm a customer</h2>
            <p className="text-sm text-gray-600 mb-4">Browse products and place orders.</p>
            <span className="text-sm text-blue-600 group-hover:underline">Continue →</span>
          </Link>

          <Link
            href="/signup/seller"
            className="bg-white border rounded-lg p-6 hover:border-black hover:shadow-sm transition group"
          >
            <h2 className="text-xl font-semibold mb-2">I'm a seller</h2>
            <p className="text-sm text-gray-600 mb-4">List products and manage your store.</p>
            <span className="text-sm text-blue-600 group-hover:underline">Continue →</span>
          </Link>
        </div>

        <p className="text-sm text-gray-600 mt-6 text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
