import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function ProductsPage({ searchParams }: { searchParams: any }) {
  const supabase = await createClient()
  const category = searchParams?.category

  let query = supabase
    .from('products')
    .select('id, name, slug, base_price, discount_price, product_images(image_url), categories(name, slug)')
    .eq('is_active', true)
    .order('id', { ascending: false })

  const { data: products } = await query
  const { data: categories } = await supabase.from('categories').select('id, name, slug').eq('is_active', true)

  const filtered = category
    ? (products || []).filter((p: any) => p.categories?.slug === category)
    : (products || [])

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b sticky top-0 bg-white z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">SMAN BD</Link>
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-900">← Home</Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">All Products</h1>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Link href="/products"
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${!category ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>
            সব
          </Link>
          {(categories || []).map((c: any) => (
            <Link key={c.id} href={`/products?category=${c.slug}`}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${category === c.slug ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>
              {c.name}
            </Link>
          ))}
        </div>

        {/* Products grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-500">কোনো product পাওয়া যায়নি।</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((p: any) => {
              const img = p.product_images?.[0]?.image_url
              const discount = p.discount_price && p.discount_price < p.base_price
              return (
                <Link key={p.id} href={`/products/${p.slug}`}
                  className="group bg-white border rounded-xl overflow-hidden hover:shadow-lg transition">
                  <div className="aspect-square bg-gray-100 relative">
                    {img ? (
                      <img src={img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">📦</div>
                    )}
                    {discount && (
                      <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">SALE</span>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-sm line-clamp-2">{p.name}</h3>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="font-bold text-blue-600">৳{p.discount_price || p.base_price}</span>
                      {discount && <span className="text-gray-400 line-through text-xs">৳{p.base_price}</span>}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
