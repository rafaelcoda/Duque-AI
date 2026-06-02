# APOIO AI × Ecolimp

Plataforma de RH inteligente — 18 fluxos operacionais automatizados com agentes de IA.

## Stack

- **Next.js 15** App Router + Turbopack
- **Supabase** — PostgreSQL + Auth + Storage + Realtime
- **Anthropic Claude Sonnet** — agentes de IA
- **Tailwind CSS** + design system próprio
- **React Query** — cache e sincronização
- **Evolution API** — gateway WhatsApp

## Estrutura de rotas

```
app/
├── (candidato)/candidato/*   → webapp mobile-first (sem sidebar)
├── (portal)/
│   ├── rh/*                  → painel da recrutadora
│   ├── gestor/*              → painel do gestor de contrato
│   ├── dp/*                  → departamento pessoal
│   ├── diretoria/*           → dashboards analíticos
│   └── qsms/*                → saúde ocupacional
├── (auth)/login, magic-link
└── api/
    ├── agentes/[fluxo]       → orquestração dos agentes IA
    └── webhooks/             → WhatsApp, D4Sign, ASO
```

## Perfis e acesso

| Perfil     | Rota        | Auth               |
|------------|-------------|--------------------|
| Candidato  | /candidato  | Magic link SMS     |
| RH         | /rh         | Email + senha      |
| Gestor     | /gestor     | Email + senha      |
| DP         | /dp         | Email + senha + MFA|
| Diretoria  | /diretoria  | Email + senha + MFA|
| QSMS       | /qsms       | Email + senha      |

## Setup

```bash
cp .env.example .env.local
npm install
npx supabase start
npm run db:push
npm run dev
```

## Agentes

| Agente             | Fluxos          | Descrição                              |
|--------------------|-----------------|----------------------------------------|
| Seleção            | RH-01 → 06      | Captação, score, entrevista virtual    |
| Saúde              | QSMS-01         | Vacinas NR32, ASO, DOC BR MED          |
| Admissão           | RH-07 → 10      | Docs, contrato, onboarding, treinamento|
| Performance        | RH-11 → 12      | ETL, dashboard KPI, chatbot 24/7       |
| Desligamento       | RH-13 → 17      | Rescisão, justa causa, TRCT, eSocial   |
| Gateway WhatsApp   | —               | Evolution API, TTS/STT, OCR            |
