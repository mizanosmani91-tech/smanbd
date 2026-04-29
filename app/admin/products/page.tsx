'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Plus, Pencil, Eye, EyeOff } from 'lucide-react'

type Product = { id: number; name: string; base_price: number; stock_qty: number; is_active: boolean; categories?: { name: string } }

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  async function load() {
    const { data } = await supabase
      .from('products').select('id, name, base_price, stock_qty, is_active, categories(name)')
      .order('id', { ascending: false })
    setProducts((data as any) || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function toggleActive(id: number, current: boolean) {
    await supabase.from('products').update({ is_active: !current }).eq('id', id)
    load()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-gray-500 mt-1">আপনার সব products</p>
        </div>
        <Link href="/admin/products/new"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          <Plus className="w-4 h-4" /> Add Product
        </Link>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : products.length === 0 ? (
          <div className="p-8 text-center text-gray-500">কোনো product নেই। উপরে "Add Product" click করুন।</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Product</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500 hidden md:table-cell">Category</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Price</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500 hidden md:table-cell">Stock</th>
                <th className="text-right px-6 py-3 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.map(p => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{p.name}</td>
                  <td className="px-6 py-4 text-gray-500 text-sm hidden md:table-cell">{(p.categories as any)?.name || '—'}</td>
                  <td className="px-6 py-4">৳{p.base_price}</td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <span className={`text-sm font-medium ${p.stock_qty <= 5 ? 'text-red-600' : 'text-green-600'}`}>
                      {p.stock_qty}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => toggleActive(p.id, p.is_active)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition">
                        {p.is_active ? <Eye className="w-4 h-4 text-green-600" /> : <EyeOff className="w-4 h-4 text-gray-400" />}
                      </button>
                      <Link href={`/admin/products/${p.id}`} className="p-2 hover:bg-gray-100 rounded-lg transition">
                        <Pencil className="w-4 h-4 text-gray-600" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
