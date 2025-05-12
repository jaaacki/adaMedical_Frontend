import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="relative bg-white rounded-xl shadow-xl p-8 max-w-lg w-full">
        <h1 className="text-3xl font-bold text-center mb-6">
          Integrated Business Operations Platform
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Welcome to the frontend for your business operations system
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link 
            href="/auth/login" 
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md text-center transition-colors"
          >
            Login
          </Link>
          <Link 
            href="/dashboard" 
            className="px-4 py-2 bg-secondary-600 hover:bg-secondary-700 text-white rounded-md text-center transition-colors"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </main>
  )
}