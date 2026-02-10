import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/server'

export default async function Home() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
        redirect('/stats')
    }

    return (
    <div className="relative size-full flex items-center justify-center overflow-hidden">
      {/* Stadium Background with Opacity */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?q=80&w=2646&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
        }}
      />
      
      {/* Dark Overlay for Better Text Readability */}
      <div className="absolute inset-0 bg-black/60" />
      
      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
          myFotbalek
        </h1>
        
        <p className="text-xl md:text-2xl text-white/90 mb-4 max-w-2xl mx-auto">
          The best app for the worst players
        </p>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/login"
            className="bg-white text-black/90 px-8 py-3 hover:scale-105 rounded-lg border-2 border-white-600 font-medium transition-colors"
          >
            Log In
          </Link>
          <Link href="/signup"
            className="bg-transparent text-white/90 px-8 py-3 hover:scale-105 rounded-lg border-2 border-white-600 font-medium transition-colors"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}