-- ============================================================
-- APOIO AI × Ecolimp — Migration 003
-- Row Level Security — isolamento por role
-- ============================================================

-- Helper: retorna o role do usuário autenticado
create or replace function auth_role()
returns text language sql security definer stable as $$
  select coalesce(
    (auth.jwt() -> 'user_metadata' ->> 'role'),
    'anonimo'
  );
$$;

-- Helper: retorna o contrato_id do usuário (gestor)
create or replace function auth_contrato_id()
returns uuid language sql security definer stable as $$
  select (auth.jwt() -> 'user_metadata' ->> 'contrato_id')::uuid;
$$;

-- ── Ativar RLS em todas as tabelas ─────────────────────────
alter table contratos       enable row level security;
alter table vagas            enable row level security;
alter table candidatos       enable row level security;
alter table candidaturas     enable row level security;
alter table eventos_fluxo    enable row level security;
alter table colaboradores    enable row level security;
alter table documentos       enable row level security;
alter table treinamentos     enable row level security;
alter table rescisoes        enable row level security;
alter table embeddings       enable row level security;
alter table audit_log        enable row level security;

-- ── CONTRATOS ───────────────────────────────────────────────
-- RH e DP veem todos; gestor vê só o seu; diretoria vê todos
create policy "contratos_rh_dp_dir" on contratos
  for select using (auth_role() in ('rh','dp','diretoria','qsms'));

create policy "contratos_gestor" on contratos
  for select using (
    auth_role() = 'gestor' and id = auth_contrato_id()
  );

create policy "contratos_insert_rh" on contratos
  for insert with check (auth_role() in ('rh','dp'));

create policy "contratos_update_rh" on contratos
  for update using (auth_role() in ('rh','dp'));

-- ── VAGAS ────────────────────────────────────────────────────
create policy "vagas_rh_dp_dir" on vagas
  for select using (auth_role() in ('rh','dp','diretoria'));

create policy "vagas_gestor" on vagas
  for select using (
    auth_role() = 'gestor' and contrato_id = auth_contrato_id()
  );

create policy "vagas_rw_rh" on vagas
  for all using (auth_role() = 'rh')
  with check (auth_role() = 'rh');

-- ── CANDIDATOS ──────────────────────────────────────────────
-- Candidato vê apenas o próprio registro
create policy "candidatos_self" on candidatos
  for select using (
    auth_role() = 'candidato'
    and telefone = (auth.jwt() -> 'user_metadata' ->> 'telefone')
  );

create policy "candidatos_update_self" on candidatos
  for update using (
    auth_role() = 'candidato'
    and telefone = (auth.jwt() -> 'user_metadata' ->> 'telefone')
  );

-- RH vê todos
create policy "candidatos_rh" on candidatos
  for all using (auth_role() in ('rh','dp','qsms'));

-- ── CANDIDATURAS ────────────────────────────────────────────
create policy "candidaturas_self" on candidaturas
  for select using (
    auth_role() = 'candidato'
    and candidato_id = (
      select id from candidatos
      where telefone = (auth.jwt() -> 'user_metadata' ->> 'telefone')
      limit 1
    )
  );

create policy "candidaturas_rh" on candidaturas
  for all using (auth_role() in ('rh','dp'));

-- ── EVENTOS (append only — sem update/delete) ────────────────
create policy "eventos_rh_read" on eventos_fluxo
  for select using (auth_role() in ('rh','dp','diretoria'));

create policy "eventos_insert_agents" on eventos_fluxo
  for insert with check (true);  -- service_role via API route

-- ── COLABORADORES ────────────────────────────────────────────
-- Colaborador vê apenas o próprio
create policy "colaboradores_self" on colaboradores
  for select using (
    auth_role() = 'candidato'
    and candidato_id = (
      select id from candidatos
      where telefone = (auth.jwt() -> 'user_metadata' ->> 'telefone')
      limit 1
    )
  );

-- Gestor vê colaboradores do seu contrato
create policy "colaboradores_gestor" on colaboradores
  for select using (
    auth_role() = 'gestor'
    and contrato_id = auth_contrato_id()
  );

create policy "colaboradores_rh_dp" on colaboradores
  for all using (auth_role() in ('rh','dp'));

create policy "colaboradores_diretoria" on colaboradores
  for select using (auth_role() = 'diretoria');

-- ── DOCUMENTOS ──────────────────────────────────────────────
create policy "documentos_self" on documentos
  for all using (
    auth_role() = 'candidato'
    and candidato_id = (
      select id from candidatos
      where telefone = (auth.jwt() -> 'user_metadata' ->> 'telefone')
      limit 1
    )
  );

create policy "documentos_rh_dp_qsms" on documentos
  for all using (auth_role() in ('rh','dp','qsms'));

-- ── TREINAMENTOS ────────────────────────────────────────────
create policy "treinamentos_self" on treinamentos
  for select using (
    auth_role() = 'candidato'
    and colaborador_id in (
      select c.id from colaboradores c
      join candidatos ca on ca.id = c.candidato_id
      where ca.telefone = (auth.jwt() -> 'user_metadata' ->> 'telefone')
    )
  );

create policy "treinamentos_rh_dp" on treinamentos
  for all using (auth_role() in ('rh','dp'));

-- ── RESCISÕES ────────────────────────────────────────────────
create policy "rescisoes_gestor_insert" on rescisoes
  for insert with check (
    auth_role() = 'gestor'
    and (
      select contrato_id from colaboradores where id = colaborador_id
    ) = auth_contrato_id()
  );

create policy "rescisoes_gestor_read" on rescisoes
  for select using (
    auth_role() = 'gestor'
    and (
      select contrato_id from colaboradores where id = colaborador_id
    ) = auth_contrato_id()
  );

create policy "rescisoes_rh_dp" on rescisoes
  for all using (auth_role() in ('rh','dp'));

-- ── EMBEDDINGS (apenas service_role escreve) ────────────────
create policy "embeddings_read" on embeddings
  for select using (auth_role() in ('rh','dp','diretoria','qsms'));

-- ── AUDIT LOG (somente leitura para DP) ─────────────────────
create policy "audit_dp_read" on audit_log
  for select using (auth_role() in ('dp','diretoria'));

create policy "audit_insert" on audit_log
  for insert with check (true);  -- service_role via trigger
