import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Genuin
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Human-only professional network
          </p>
          <div className="space-x-4">
            <Link
              href="/auth/register"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Get Started
            </Link>
            <Link
              href="/auth/login"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg border border-blue-600 hover:bg-blue-50 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-3">Human-Centric</h3>
            <p className="text-gray-600">
              Connect with real people in professional networking, verified by our AI detection system.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-3">Secure & Private</h3>
            <p className="text-gray-600">
              Your data is protected with industry-standard security measures and privacy controls.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-3">AI Moderated</h3>
            <p className="text-gray-600">
              Advanced AI helps moderate content while ensuring human authenticity.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}