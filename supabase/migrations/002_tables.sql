-- ============================================================
-- APOIO AI × Ecolimp — Migration 002
-- Tabelas principais
-- ============================================================

-- ── Contratos ───────────────────────────────────────────────
create table contratos (
  id              uuid primary key default uuid_generate_v4(),
  cliente         text not null,
  unidade         text not null,
  gestor_id       uuid references auth.users(id) on delete set null,
  orcamento_mensal int not null default 0,
  status          text not null default 'ativo'
                    check (status in ('ativo','encerrado','suspenso')),
  criado_em       timestamptz not null default now(),
  atualizado_em   timestamptz not null default now()
);

-- ── Vagas ────────────────────────────────────────────────────
create table vagas (
  id              uuid primary key default uuid_generate_v4(),
  contrato_id     uuid not null references contratos(id) on delete cascade,
  cargo           text not null,
  unidade         text not null,
  quantidade      int not null default 1,
  status          text not null default 'aberta'
                    check (status in ('aberta','em_selecao','encerrada','pausada')),
  requisitos      jsonb not null default '{}',
  criado_em       timestamptz not null default now(),
  atualizado_em   timestamptz not null default now()
);

-- ── Candidatos ──────────────────────────────────────────────
create table candidatos (
  id                  uuid primary key default uuid_generate_v4(),
  nome                text not null,
  telefone            text not null unique,
  cpf                 text unique,
  cep                 text,
  cidade              text,
  estado              text,
  lat                 float,
  lng                 float,
  status              status_candidato not null default 'novo',
  score_curriculo     int check (score_curriculo between 0 and 100),
  perfil_disc         text,
  motivo_reprovacao   text,
  bloqueado           boolean not null default false,
  consentimento_lgpd  boolean not null default false,
  consentimento_em    timestamptz,
  criado_em           timestamptz not null default now(),
  atualizado_em       timestamptz not null default now()
);

-- ── Candidaturas ────────────────────────────────────────────
create table candidaturas (
  id                uuid primary key default uuid_generate_v4(),
  candidato_id      uuid not null references candidatos(id) on delete cascade,
  vaga_id           uuid not null references vagas(id) on delete cascade,
  etapa_atual       status_candidato not null default 'novo',
  resultado         text check (resultado in ('em_andamento','aprovado','reprovado','banco')),
  score_entrevista  int check (score_entrevista between 0 and 100),
  aprovado_por      uuid references auth.users(id) on delete set null,
  criado_em         timestamptz not null default now(),
  atualizado_em     timestamptz not null default now(),
  unique (candidato_id, vaga_id)
);

-- ── Eventos de fluxo (imutável — append only) ───────────────
create table eventos_fluxo (
  id               uuid primary key default uuid_generate_v4(),
  candidatura_id   uuid not null references candidaturas(id) on delete cascade,
  fluxo            fluxo_agente not null,
  etapa            text not null,
  payload          jsonb not null default '{}',
  agente_versao    text,
  criado_em        timestamptz not null default now()
);

-- ── Colaboradores ────────────────────────────────────────────
create table colaboradores (
  id                uuid primary key default uuid_generate_v4(),
  candidato_id      uuid not null references candidatos(id) on delete restrict,
  matricula         text unique,
  contrato_id       uuid not null references contratos(id) on delete restrict,
  cargo             text not null,
  status            status_colaborador not null default 'experiencia',
  data_admissao     date not null,
  data_efetivacao   date,
  salario           numeric(10,2) not null,
  jornada           jornada_tipo not null default 'clt_44h',
  criado_em         timestamptz not null default now(),
  atualizado_em     timestamptz not null default now()
);

-- ── Documentos ──────────────────────────────────────────────
create table documentos (
  id                uuid primary key default uuid_generate_v4(),
  candidato_id      uuid not null references candidatos(id) on delete cascade,
  tipo              tipo_documento not null,
  storage_path      text,
  status            status_documento not null default 'pendente',
  ocr_data          jsonb,
  motivo_rejeicao   text,
  enviado_em        timestamptz,
  validado_em       timestamptz,
  criado_em         timestamptz not null default now()
);

-- ── Treinamentos ────────────────────────────────────────────
create table treinamentos (
  id              uuid primary key default uuid_generate_v4(),
  colaborador_id  uuid not null references colaboradores(id) on delete cascade,
  modulo          text not null,
  cargo           text not null,
  tentativas      int not null default 0,
  aprovado        boolean not null default false,
  score           int check (score between 0 and 100),
  cert_path       text,
  validade        date,
  criado_em       timestamptz not null default now(),
  atualizado_em   timestamptz not null default now()
);

-- ── Rescisões ────────────────────────────────────────────────
create table rescisoes (
  id               uuid primary key default uuid_generate_v4(),
  colaborador_id   uuid not null references colaboradores(id) on delete restrict,
  modalidade       modalidade_rescisao not null,
  status           status_rescisao not null default 'solicitado',
  solicitado_por   uuid not null references auth.users(id),
  aprovado_por     uuid references auth.users(id),
  data_aviso       date,
  data_efetiva     date,
  verbas_json      jsonb,
  esocial_enviado  boolean not null default false,
  observacoes      text,
  criado_em        timestamptz not null default now(),
  atualizado_em    timestamptz not null default now()
);

-- ── Embeddings RAG ──────────────────────────────────────────
create table embeddings (
  id           uuid primary key default uuid_generate_v4(),
  tipo         text not null,   -- 'treinamento', 'faq', 'procedimento'
  referencia   text not null,   -- cargo ou módulo
  conteudo     text not null,
  embedding    vector(1536),
  criado_em    timestamptz not null default now()
);

-- ── Audit log (append only) ─────────────────────────────────
create table audit_log (
  id           uuid primary key default uuid_generate_v4(),
  usuario_id   uuid references auth.users(id) on delete set null,
  acao         text not null,
  tabela       text not null,
  registro_id  uuid,
  antes        jsonb,
  depois       jsonb,
  ip           text,
  criado_em    timestamptz not null default now()
);

-- ── Índices ─────────────────────────────────────────────────
create index idx_candidatos_telefone  on candidatos(telefone);
create index idx_candidatos_status    on candidatos(status);
create index idx_candidaturas_vaga    on candidaturas(vaga_id);
create index idx_candidaturas_cand    on candidaturas(candidato_id);
create index idx_eventos_candidatura  on eventos_fluxo(candidatura_id);
create index idx_colaboradores_contr  on colaboradores(contrato_id);
create index idx_colaboradores_status on colaboradores(status);
create index idx_documentos_candidato on documentos(candidato_id);
create index idx_embeddings_vector    on embeddings using ivfflat (embedding vector_cosine_ops);
create index idx_audit_tabela         on audit_log(tabela, registro_id);

-- ── Trigger updated_at ──────────────────────────────────────
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.atualizado_em = now();
  return new;
end;
$$;

create trigger trg_contratos_updated   before update on contratos   for each row execute function set_updated_at();
create trigger trg_vagas_updated       before update on vagas       for each row execute function set_updated_at();
create trigger trg_candidatos_updated  before update on candidatos  for each row execute function set_updated_at();
create trigger trg_candidaturas_upd    before update on candidaturas for each row execute function set_updated_at();
create trigger trg_colaboradores_upd   before update on colaboradores for each row execute function set_updated_at();
create trigger trg_treinamentos_upd    before update on treinamentos for each row execute function set_updated_at();
create trigger trg_rescisoes_upd       before update on rescisoes   for each row execute function set_updated_at();
