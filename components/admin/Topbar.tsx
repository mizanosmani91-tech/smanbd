'use client'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { LogOut, User } from 'lucide-react'

export default function AdminTopbar({ user }: { user: { email: string; name: string | null; role: string } }) {
  const router = useRouter()
  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }
  const roleLabel = { staff:'Staff', manager:'Manager', super_admin:'Super Admin' }[user.role] || user.role
  return (
    <header className="bg-white border-b h-16 flex items-center justify-between px-4 md:px-6">
      <p className="text-sm font-medium text-gray-600">
        {new Date().toLocaleDateString('bn-BD', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}
      </p>
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium">{user.name || user.email}</p>
          <p className="text-xs text-gray-500">{roleLabel}</p>
        </div>
        <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
          <User className="w-5 h-5" />
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition">
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  )
}
