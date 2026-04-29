'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, FileText, Wallet, Tags } from 'lucide-react'

const menu = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/categories', label: 'Categories', icon: Tags },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/customers', label: 'Customers', icon: Users },
  { href: '/admin/accounting', label: 'Accounting', icon: Wallet, role: ['manager','super_admin'] },
  { href: '/admin/page-builder', label: 'Page Builder', icon: FileText, role: ['manager','super_admin'] },
  { href: '/admin/settings', label: 'Settings', icon: Settings, role: ['super_admin'] },
]

export default function AdminSidebar({ role }: { role: string }) {
  const pathname = usePathname()
  const items = menu.filter(item => !item.role || item.role.includes(role))
  return (
    <aside className="w-16 md:w-64 bg-slate-900 text-white min-h-screen flex flex-col">
      <div className="p-4 md:p-6 border-b border-slate-800">
        <h1 className="hidden md:block text-xl font-bold">SMAN BD</h1>
        <p className="hidden md:block text-xs text-slate-400 mt-1">Admin Panel</p>
        <span className="md:hidden text-lg font-bold">S</span>
      </div>
      <nav className="flex-1 p-2 md:p-3 space-y-1">
        {items.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
          const Icon = item.icon
          return (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 px-2 md:px-3 py-2.5 rounded-lg text-sm font-medium transition ${isActive ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}>
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="hidden md:inline">{item.label}</span>
            </Link>
          )
        })}
      </nav>
      <div className="p-3 border-t border-slate-800 text-xs text-slate-400 hidden md:block">v0.1.0</div>
    </aside>
  )
}
