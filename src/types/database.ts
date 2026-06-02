// Gerado por: supabase gen types typescript --local
// Atualizar com: npm run db:types

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export type Role = 'candidato' | 'rh' | 'gestor' | 'dp' | 'diretoria' | 'qsms'

export type StatusCandidato =
  | 'novo' | 'analise' | 'antecedentes' | 'comportamental'
  | 'agendado' | 'entrevistado' | 'qsms' | 'documentos'
  | 'contrato' | 'admitido' | 'reprovado' | 'banco'

export type StatusColaborador = 'ativo' | 'experiencia' | 'afastado' | 'desligado'

export type ModalidadeRescisao =
  | 'sem_justa_causa' | 'justa_causa_conduta' | 'justa_causa_abandono'
  | 'pedido_demissao' | 'termino_experiencia'

export type StatusRescisao =
  | 'solicitado' | 'checklist' | 'aviso' | 'cumprindo_aviso'
  | 'trct_gerado' | 'homologacao' | 'encerrado'

export type TipoDocumento =
  | 'rg' | 'cpf' | 'ctps' | 'comprovante_residencia'
  | 'cartao_vacina' | 'laudo_aso' | 'contrato_assinado'
  | 'certificado_treinamento'

export type StatusDocumento = 'pendente' | 'enviado' | 'validado' | 'rejeitado'

export type FluxoAgente =
  | 'RH-01' | 'RH-02' | 'RH-03' | 'RH-04' | 'RH-05' | 'RH-06'
  | 'QSMS-01'
  | 'RH-07' | 'RH-08' | 'RH-09' | 'RH-10'
  | 'RH-11' | 'RH-12'
  | 'RH-13' | 'RH-14' | 'RH-15' | 'RH-16' | 'RH-17'

export interface Database {
  public: {
    Tables: {
      contratos: {
        Row: {
          id: string
          cliente: string
          unidade: string
          gestor_id: string | null
          orcamento_mensal: number
          status: 'ativo' | 'encerrado' | 'suspenso'
          criado_em: string
          atualizado_em: string
        }
        Insert: Omit<Database['public']['Tables']['contratos']['Row'], 'id' | 'criado_em' | 'atualizado_em'>
        Update: Partial<Database['public']['Tables']['contratos']['Insert']>
      }
      vagas: {
        Row: {
          id: string
          contrato_id: string
          cargo: string
          unidade: string
          quantidade: number
          status: 'aberta' | 'em_selecao' | 'encerrada' | 'pausada'
          requisitos: Json
          criado_em: string
          atualizado_em: string
        }
        Insert: Omit<Database['public']['Tables']['vagas']['Row'], 'id' | 'criado_em' | 'atualizado_em'>
        Update: Partial<Database['public']['Tables']['vagas']['Insert']>
      }
      candidatos: {
        Row: {
          id: string
          nome: string
          telefone: string
          cpf: string | null
          cep: string | null
          cidade: string | null
          estado: string | null
          lat: number | null
          lng: number | null
          status: StatusCandidato
          score_curriculo: number | null
          perfil_disc: string | null
          motivo_reprovacao: string | null
          bloqueado: boolean
          consentimento_lgpd: boolean
          consentimento_em: string | null
          criado_em: string
          atualizado_em: string
        }
        Insert: Omit<Database['public']['Tables']['candidatos']['Row'], 'id' | 'criado_em' | 'atualizado_em'>
        Update: Partial<Database['public']['Tables']['candidatos']['Insert']>
      }
      candidaturas: {
        Row: {
          id: string
          candidato_id: string
          vaga_id: string
          etapa_atual: StatusCandidato
          resultado: 'em_andamento' | 'aprovado' | 'reprovado' | 'banco' | null
          score_entrevista: number | null
          aprovado_por: string | null
          criado_em: string
          atualizado_em: string
        }
        Insert: Omit<Database['public']['Tables']['candidaturas']['Row'], 'id' | 'criado_em' | 'atualizado_em'>
        Update: Partial<Database['public']['Tables']['candidaturas']['Insert']>
      }
      eventos_fluxo: {
        Row: {
          id: string
          candidatura_id: string
          fluxo: FluxoAgente
          etapa: string
          payload: Json
          agente_versao: string | null
          criado_em: string
        }
        Insert: Omit<Database['public']['Tables']['eventos_fluxo']['Row'], 'id' | 'criado_em'>
        Update: never
      }
      colaboradores: {
        Row: {
          id: string
          candidato_id: string
          matricula: string | null
          contrato_id: string
          cargo: string
          status: StatusColaborador
          data_admissao: string
          data_efetivacao: string | null
          salario: number
          jornada: 'clt_44h' | 'diarista' | 'plantao'
          criado_em: string
          atualizado_em: string
        }
        Insert: Omit<Database['public']['Tables']['colaboradores']['Row'], 'id' | 'criado_em' | 'atualizado_em'>
        Update: Partial<Database['public']['Tables']['colaboradores']['Insert']>
      }
      documentos: {
        Row: {
          id: string
          candidato_id: string
          tipo: TipoDocumento
          storage_path: string | null
          status: StatusDocumento
          ocr_data: Json | null
          motivo_rejeicao: string | null
          enviado_em: string | null
          validado_em: string | null
          criado_em: string
        }
        Insert: Omit<Database['public']['Tables']['documentos']['Row'], 'id' | 'criado_em'>
        Update: Partial<Database['public']['Tables']['documentos']['Insert']>
      }
      treinamentos: {
        Row: {
          id: string
          colaborador_id: string
          modulo: string
          cargo: string
          tentativas: number
          aprovado: boolean
          score: number | null
          cert_path: string | null
          validade: string | null
          criado_em: string
          atualizado_em: string
        }
        Insert: Omit<Database['public']['Tables']['treinamentos']['Row'], 'id' | 'criado_em' | 'atualizado_em'>
        Update: Partial<Database['public']['Tables']['treinamentos']['Insert']>
      }
      rescisoes: {
        Row: {
          id: string
          colaborador_id: string
          modalidade: ModalidadeRescisao
          status: StatusRescisao
          solicitado_por: string
          aprovado_por: string | null
          data_aviso: string | null
          data_efetiva: string | null
          verbas_json: Json | null
          esocial_enviado: boolean
          observacoes: string | null
          criado_em: string
          atualizado_em: string
        }
        Insert: Omit<Database['public']['Tables']['rescisoes']['Row'], 'id' | 'criado_em' | 'atualizado_em'>
        Update: Partial<Database['public']['Tables']['rescisoes']['Insert']>
      }
      audit_log: {
        Row: {
          id: string
          usuario_id: string | null
          acao: string
          tabela: string
          registro_id: string | null
          antes: Json | null
          depois: Json | null
          ip: string | null
          criado_em: string
        }
        Insert: Omit<Database['public']['Tables']['audit_log']['Row'], 'id' | 'criado_em'>
        Update: never
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      role: Role
      status_candidato: StatusCandidato
      status_colaborador: StatusColaborador
      modalidade_rescisao: ModalidadeRescisao
      tipo_documento: TipoDocumento
      fluxo_agente: FluxoAgente
    }
  }
}
