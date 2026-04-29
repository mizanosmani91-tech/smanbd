import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: product } = await supabase
    .from('products')
    .select('*, product_images(image_url, is_primary), categories(name)')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (!product) notFound()

  const { data: settings } = await supabase.from('site_settings').select('phone, whatsapp').single()

  const mainImage = product.product_images?.find((i: any) => i.is_primary)?.image_url
    || product.product_images?.[0]?.image_url

  const price = product.discount_price || product.base_price
  const hasDiscount = product.discount_price && product.discount_price < product.base_price
  const discountPct = hasDiscount ? Math.round((1 - product.discount_price / product.base_price) * 100) : 0
  const waMsg = encodeURIComponent(product.name + " অর্ডার করতে চাই। দাম: " + price)

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b sticky top-0 bg-white z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">SMAN BD</Link>
          <Link href="/products" className="text-sm text-gray-500 hover:text-gray-900">Products</Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-10">
          <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden">
            {mainImage ? (
              <img src={mainImage} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>
            )}
          </div>

          <div className="space-y-5">
            <div>
              <p className="text-sm text-blue-600 font-medium">{(product.categories as any)?.name}</p>
              <h1 className="text-2xl font-bold mt-1">{product.name}</h1>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-blue-600">৳{price}</span>
              {hasDiscount && (
                <>
                  <span className="text-gray-400 line-through text-lg">৳{product.base_price}</span>
                  <span className="bg-red-100 text-red-600 text-sm px-2 py-1 rounded-full font-medium">{discountPct}% OFF</span>
                </>
              )}
            </div>

            {product.short_description && (
              <p className="text-gray-600 leading-relaxed">{product.short_description}</p>
            )}

            <div className="flex items-center gap-2 text-sm">
              <span className={"w-2 h-2 rounded-full " + (product.stock_qty > 0 ? "bg-green-500" : "bg-red-500")}></span>
              <span className={product.stock_qty > 0 ? "text-green-600" : "text-red-600"}>
                {product.stock_qty > 0 ? "In Stock (" + product.stock_qty + " available)" : "Out of Stock"}
              </span>
            </div>

            <div className="space-y-3 pt-2">
              <a href={"https://wa.me/88" + settings?.whatsapp + "?text=" + waMsg}
                target="_blank" rel="noopener noreferrer"
                className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition">
                WhatsApp এ অর্ডার করুন
              </a>
              <a href={"tel:" + settings?.phone}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition">
                Call করুন: {settings?.phone}
              </a>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              {["সারা বাংলাদেশে ডেলিভারি", "Cash on Delivery", "Easy Return Policy", "Quality Guaranteed"].map(item => (
                <div key={item} className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600 text-center">{item}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
