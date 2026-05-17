import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AskInterface from '@/components/dashboard/AskInterface'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="w-full h-full overflow-y-auto bg-white">
      <AskInterface userEmail={user.email || ''} />
    </div>
  )
}
