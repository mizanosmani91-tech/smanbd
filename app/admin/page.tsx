import { createClient } from '@/lib/supabase/server'
import { Package, ShoppingCart, Users, TrendingUp } from 'lucide-react'

export default async function AdminDashboard() {
  const supabase = await createClient()
  const [{ count: productCount },{ count: orderCount },{ count: customerCount }] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'customer'),
  ])
  const stats = [
    { label: 'মোট Products', value: productCount ?? 0, icon: Package, color: 'bg-blue-50 text-blue-600' },
    { label: 'মোট Orders', value: orderCount ?? 0, icon: ShoppingCart, color: 'bg-green-50 text-green-600' },
    { label: 'Customers', value: customerCount ?? 0, icon: Users, color: 'bg-purple-50 text-purple-600' },
    { label: 'এই মাসের Revenue', value: '৳ 0', icon: TrendingUp, color: 'bg-orange-50 text-orange-600' },
  ]
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-500 mt-1">আপনার store এর overview</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="bg-white rounded-xl border p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold mt-2">{stat.value}</p>
                </div>
                <div className={`p-2.5 rounded-lg ${stat.color}`}><Icon className="w-5 h-5" /></div>
              </div>
            </div>
          )
        })}
      </div>
      <div className="bg-white rounded-xl border p-6">
        <h2 className="font-semibold mb-3">পরবর্তী কাজ</h2>
        <ul className="text-sm text-gray-600 space-y-2">
          <li>✅ Admin login ready</li>
          <li>⏭️ Day 3: Product add করুন</li>
          <li>⏭️ Day 4: Storefront homepage</li>
        </ul>
      </div>
    </div>
  )
}
