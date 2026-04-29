import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminSidebar from '@/components/admin/Sidebar'
import AdminTopbar from '@/components/admin/Topbar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase.from('profiles').select('full_name, role').eq('id', user.id).single()
  if (!profile || !['staff','manager','super_admin'].includes(profile.role)) redirect('/')
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar role={profile.role} />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopbar user={{ email: user.email!, name: profile.full_name, role: profile.role }} />
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
