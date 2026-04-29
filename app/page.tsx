import { createClient } from '@/lib/supabase/server'

export default async function Home() {
  const supabase = await createClient()
  const { data: settings } = await supabase
    .from('site_settings')
    .select('*')
    .single()

  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">
          {settings?.site_name || 'Database not connected'}
        </h1>
        <p className="text-gray-600">✅ Supabase connected!</p>
        <p className="text-sm text-gray-500">Phone: {settings?.phone}</p>
      </div>
    </main>
  )
}
