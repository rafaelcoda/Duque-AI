-- ============================================================
-- APOIO AI × Ecolimp — Migration 001
-- Extensões e enums base
-- ============================================================

-- Extensões
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";
create extension if not exists "vector";          -- pgvector para RAG

-- Enums
create type role as enum (
  'candidato', 'rh', 'gestor', 'dp', 'diretoria', 'qsms'
);

create type status_candidato as enum (
  'novo', 'analise', 'antecedentes', 'comportamental',
  'agendado', 'entrevistado', 'qsms', 'documentos',
  'contrato', 'admitido', 'reprovado', 'banco'
);

create type status_colaborador as enum (
  'ativo', 'experiencia', 'afastado', 'desligado'
);

create type modalidade_rescisao as enum (
  'sem_justa_causa', 'justa_causa_conduta',
  'justa_causa_abandono', 'pedido_demissao', 'termino_experiencia'
);

create type status_rescisao as enum (
  'solicitado', 'checklist', 'aviso', 'cumprindo_aviso',
  'trct_gerado', 'homologacao', 'encerrado'
);

create type tipo_documento as enum (
  'rg', 'cpf', 'ctps', 'comprovante_residencia',
  'cartao_vacina', 'laudo_aso', 'contrato_assinado',
  'certificado_treinamento'
);

create type status_documento as enum (
  'pendente', 'enviado', 'validado', 'rejeitado'
);

create type fluxo_agente as enum (
  'RH-01', 'RH-02', 'RH-03', 'RH-04', 'RH-05', 'RH-06',
  'QSMS-01',
  'RH-07', 'RH-08', 'RH-09', 'RH-10',
  'RH-11', 'RH-12',
  'RH-13', 'RH-14', 'RH-15', 'RH-16', 'RH-17'
);

create type jornada_tipo as enum ('clt_44h', 'diarista', 'plantao');
