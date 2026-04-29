import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function Home() {
  const supabase = await createClient()

  const { data: settings } = await supabase
    .from('site_settings').select('*').single()

  const { data: products } = await supabase
    .from('products')
    .select('id, name, slug, base_price, discount_price, product_images(image_url)')
    .eq('is_active', true)
    .order('id', { ascending: false })
    .limit(8)

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b sticky top-0 bg-white z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">SMAN BD</Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/products" className="hover:text-blue-600 transition">All Products</Link>
          </nav>
          <a href={"tel:" + settings?.phone}
            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition">
            অর্ডার করুন
          </a>
        </div>
      </header>

      <section className="bg-gradient-to-br from-slate-900 to-slate-700 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Premium Quality<br />
            <span className="text-yellow-400">Leather and Lifestyle</span>
          </h1>
          <p className="text-slate-300 text-lg max-w-xl mx-auto">
            সেরা মানের leather wallet, পোশাক ও ঘড়ি। সারা বাংলাদেশে ডেলিভারি।
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products"
              className="bg-yellow-400 text-slate-900 px-8 py-3 rounded-xl font-bold hover:bg-yellow-300 transition">
              সব Products দেখুন
            </Link>
            <a href={"tel:" + settings?.phone}
              className="border border-white text-white px-8 py-3 rounded-xl font-medium hover:bg-white hover:text-slate-900 transition">
              {settings?.phone}
            </a>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">সব Products</h2>
            <Link href="/products" className="text-blue-600 hover:underline text-sm">সব দেখুন</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {(products || []).map((p: any) => {
              const img = p.product_images?.[0]?.image_url
              const discount = p.discount_price && p.discount_price < p.base_price
              return (
                <Link key={p.id} href={"/products/" + p.slug}
                  className="group bg-white border rounded-xl overflow-hidden hover:shadow-lg transition">
                  <div className="aspect-square bg-gray-100 relative overflow-hidden">
                    {img ? (
                      <img src={img} alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl">no img</div>
                    )}
                    {discount && (
                      <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">SALE</span>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-sm leading-tight line-clamp-2">{p.name}</h3>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="font-bold text-blue-600">৳{p.discount_price || p.base_price}</span>
                      {discount && (
                        <span className="text-gray-400 line-through text-xs">৳{p.base_price}</span>
                      )}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">কেন SMAN BD?</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: 'star', title: 'Premium Quality', desc: 'সর্বোচ্চ মানের পণ্য' },
              { icon: 'truck', title: 'Fast Delivery', desc: 'সারা বাংলাদেশে ডেলিভারি' },
              { icon: 'money', title: 'Best Price', desc: 'সেরা দামে সেরা পণ্য' },
              { icon: 'return', title: 'Easy Return', desc: 'সহজ রিটার্ন পলিসি' },
            ].map(item => (
              <div key={item.title} className="text-center space-y-2 p-4 bg-white rounded-xl border">
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 text-slate-400 py-10 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-white font-bold text-lg mb-2">SMAN BD</h3>
          <p className="text-sm mb-2">Phone: {settings?.phone}</p>
          <p className="text-sm">2026 SMAN BD. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
