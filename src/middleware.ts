import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

// Rotas públicas — não precisam de sessão
const PUBLIC_PATHS = ['/candidato', '/login', '/magic-link']

// Mapa de role → prefixo de rota permitido
const ROLE_PATHS: Record<string, string[]> = {
  candidato: ['/candidato'],
  rh:        ['/rh'],
  gestor:    ['/gestor'],
  dp:        ['/dp'],
  diretoria: ['/diretoria'],
  qsms:      ['/qsms'],
}

// Roles que exigem MFA ativo
const MFA_REQUIRED_ROLES = ['dp', 'diretoria']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Webhooks e API interna — validados por HMAC, não por sessão
  if (pathname.startsWith('/api/webhooks')) return NextResponse.next()

  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Rotas públicas — candidato acessa com token na URL
  const isPublic = PUBLIC_PATHS.some(p => pathname.startsWith(p))
  if (isPublic) return response

  // Sem sessão → login
  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const role = user.user_metadata?.role as string | undefined

  // Verifica se role tem acesso à rota
  const allowedPaths = ROLE_PATHS[role ?? ''] ?? []
  const hasAccess = allowedPaths.some(p => pathname.startsWith(p))
  if (!hasAccess) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // MFA obrigatório para DP e Diretoria
  if (role && MFA_REQUIRED_ROLES.includes(role)) {
    const { data: mfaData } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
    if (mfaData?.currentLevel !== 'aal2') {
      return NextResponse.redirect(new URL('/login?mfa=required', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|manifest.json|icons/).*)',
  ],
}
