'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Upload } from 'lucide-react'

type Category = { id: number; name: string }

export default function NewProductPage() {
  const router = useRouter()
  const supabase = createClient()
  const [categories, setCategories] = useState<Category[]>([])
  const [saving, setSaving] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState('')
  const [form, setForm] = useState({
    name: '', category_id: '', base_price: '', discount_price: '',
    cost_price: '', stock_qty: '0', short_description: '',
    is_active: true, is_featured: false,
  })

  useEffect(() => {
    supabase.from('categories').select('id, name').then(({ data }) => setCategories(data || []))
  }, [])

  function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const slug = form.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') + '-' + Date.now()
      let imageUrl = ''
      if (imageFile) {
        const ext = imageFile.name.split('.').pop()
        const path = `${slug}.${ext}`
        const { error: upErr } = await supabase.storage.from('products').upload(path, imageFile)
        if (!upErr) {
          const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(path)
          imageUrl = publicUrl
        }
      }
      const { data: product, error } = await supabase.from('products').insert({
        name: form.name,
        slug,
        category_id: form.category_id ? parseInt(form.category_id) : null,
        base_price: parseFloat(form.base_price),
        discount_price: form.discount_price ? parseFloat(form.discount_price) : null,
        cost_price: form.cost_price ? parseFloat(form.cost_price) : null,
        stock_qty: parseInt(form.stock_qty),
        short_description: form.short_description,
        is_active: form.is_active,
        is_featured: form.is_featured,
      }).select().single()

      if (error) throw error

      if (imageUrl && product) {
        await supabase.from('product_images').insert({
          product_id: product.id, image_url: imageUrl, is_primary: true, display_order: 0
        })
      }
      router.push('/admin/products')
    } catch (err) {
      console.error(err)
      alert('Error saving product')
    }
    setSaving(false)
  }

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">New Product</h1>
        <p className="text-gray-500 mt-1">নতুন product add করুন</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl border p-6 space-y-4">
          <h2 className="font-semibold">Product Image</h2>
          <label className="block cursor-pointer">
            <div className={`border-2 border-dashed rounded-xl p-6 text-center hover:border-blue-400 transition ${imagePreview ? 'border-blue-400' : 'border-gray-300'}`}>
              {imagePreview ? (
                <img src={imagePreview} alt="preview" className="w-40 h-40 object-cover rounded-lg mx-auto" />
              ) : (
                <div className="space-y-2">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                  <p className="text-sm text-gray-500">Click করে image select করুন</p>
                </div>
              )}
            </div>
            <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
          </label>
        </div>

        <div className="bg-white rounded-xl border p-6 space-y-4">
          <h2 className="font-semibold">Basic Info</h2>
          <div>
            <label className="block text-sm font-medium mb-1">Product Name *</label>
            <input value={form.name} onChange={e => set('name', e.target.value)} required
              placeholder="যেমন: Premium Leather Wallet"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select value={form.category_id} onChange={e => set('category_id', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Select category</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Short Description</label>
            <textarea value={form.short_description} onChange={e => set('short_description', e.target.value)}
              rows={2} placeholder="এক-দুই লাইনে product describe করুন"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl border p-6 space-y-4">
          <h2 className="font-semibold">Pricing & Stock</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Regular Price (৳) *</label>
              <input type="number" value={form.base_price} onChange={e => set('base_price', e.target.value)} required
                placeholder="850"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Sale Price (৳)</label>
              <input type="number" value={form.discount_price} onChange={e => set('discount_price', e.target.value)}
                placeholder="650"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Cost Price (৳)</label>
              <input type="number" value={form.cost_price} onChange={e => set('cost_price', e.target.value)}
                placeholder="400"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Stock Quantity</label>
              <input type="number" value={form.stock_qty} onChange={e => set('stock_qty', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-6 space-y-3">
          <h2 className="font-semibold">Settings</h2>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.is_active} onChange={e => set('is_active', e.target.checked)} className="w-4 h-4 rounded" />
            <span className="text-sm">Active (website এ দেখাবে)</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.is_featured} onChange={e => set('is_featured', e.target.checked)} className="w-4 h-4 rounded" />
            <span className="text-sm">Featured (homepage এ দেখাবে)</span>
          </label>
        </div>

        <button type="submit" disabled={saving}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition disabled:opacity-50">
          {saving ? 'Saving...' : 'Save Product'}
        </button>
      </form>
    </div>
  )
}
