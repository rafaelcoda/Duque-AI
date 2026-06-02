import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function RootPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const role = user.user_metadata?.role as string | undefined

  const roleRedirects: Record<string, string> = {
    candidato:  '/candidato',
    rh:         '/rh',
    gestor:     '/gestor',
    dp:         '/dp',
    diretoria:  '/diretoria',
    qsms:       '/qsms',
  }

  redirect(roleRedirects[role ?? ''] ?? '/login')
}
