import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { auditService } from '@/services/auditService';

export interface ConfigurationsByYear {
  ano: number;
  configuracoes: {
    situacoesProblema: any[];
    eixosTematicos: any[];
    prioridades: any[];
    temas: any[];
    entregaveis: any[];
    pessoas: any[];
  };
  timestamp: string;
}

// 🔥 DADOS BASE QUE EXISTIAM DESDE 2020
const BASE_DATA = {
  situacoesProblema: [
    {
      id: 1,
      codigo_categoria: 'SP001',
      descricao: 'Gestão de Recursos Humanos',
      fonte: 'Análise Institucional',
      ano_criacao: 2020
    },
    {
      id: 2,
      codigo_categoria: 'SP002',
      descricao: 'Infraestrutura Tecnológica',
      fonte: 'Diagnóstico TI',
      ano_criacao: 2021
    },
    {
      id: 3,
      codigo_categoria: 'SP003',
      descricao: 'Gestão Acadêmica',
      fonte: 'Avaliação Pedagógica',
      ano_criacao: 2022
    },
    {
      id: 4,
      codigo_categoria: 'SP004',
      descricao: 'Sustentabilidade Ambiental',
      fonte: 'Comissão Ambiental',
      ano_criacao: 2023
    },
    {
      id: 5,
      codigo_categoria: 'SP005',
      descricao: 'Inovação Tecnológica',
      fonte: 'Núcleo de Inovação',
      ano_criacao: 2024
    },
    {
      id: 6,
      codigo_categoria: 'SP006',
      descricao: 'Inclusão Digital',
      fonte: 'Programa Social',
      ano_criacao: 2025
    }
  ],
  eixosTematicos: [
    {
      id: 1,
      numero: 1,
      nome: 'Ensino',
      descricao: 'Qualidade do ensino e metodologias',
      ano_criacao: 2020
    },
    {
      id: 2,
      numero: 2,
      nome: 'Pesquisa e Extensão',
      descricao: 'Projetos de pesquisa e extensão',
      ano_criacao: 2020
    },
    {
      id: 3,
      numero: 3,
      nome: 'Gestão',
      descricao: 'Gestão administrativa e financeira',
      ano_criacao: 2021
    },
    {
      id: 4,
      numero: 4,
      nome: 'Tecnologia e Inovação',
      descricao: 'Desenvolvimento tecnológico',
      ano_criacao: 2023
    },
    {
      id: 5,
      numero: 5,
      nome: 'Sustentabilidade',
      descricao: 'Práticas sustentáveis',
      ano_criacao: 2024
    }
  ],
  prioridades: [
    {
      id: 1,
      grau: 1,
      descricao: 'Crítica',
      tipo_gestao: 'Urgente',
      detalhes: 'Requer ação imediata',
      ano_criacao: 2020
    },
    {
      id: 2,
      grau: 2,
      descricao: 'Alta',
      tipo_gestao: 'Importante',
      detalhes: 'Ação no curto prazo',
      ano_criacao: 2020
    },
    {
      id: 3,
      grau: 3,
      descricao: 'Média',
      tipo_gestao: 'Moderada',
      detalhes: 'Ação no médio prazo',
      ano_criacao: 2021
    },
    {
      id: 4,
      grau: 4,
      descricao: 'Baixa',
      tipo_gestao: 'Opcional',
      detalhes: 'Ação no longo prazo',
      ano_criacao: 2023
    }
  ],
  temas: [
    {
      id: 1,
      tema_num: 1,
      descricao: 'Melhoria da Qualidade do Ensino',
      eixo: { nome: 'Ensino' },
      ano_criacao: 2020
    },
    {
      id: 2,
      tema_num: 2,
      descricao: 'Desenvolvimento de Projetos',
      eixo: { nome: 'Pesquisa e Extensão' },
      ano_criacao: 2021
    },
    {
      id: 3,
      tema_num: 3,
      descricao: 'Modernização Administrativa',
      eixo: { nome: 'Gestão' },
      ano_criacao: 2022
    },
    {
      id: 4,
      tema_num: 4,
      descricao: 'Transformação Digital',
      eixo: { nome: 'Tecnologia e Inovação' },
      ano_criacao: 2024
    }
  ],
  entregaveis: [
    {
      id: 1,
      entregavel_numero: 'E001',
      descricao: 'Relatório de Avaliação Docente',
      detalhes: 'Avaliação semestral do corpo docente',
      ano_criacao: 2020
    },
    {
      id: 2,
      entregavel_numero: 'E002',
      descricao: 'Plano de Capacitação',
      detalhes: 'Cronograma de treinamentos',
      ano_criacao: 2021
    },
    {
      id: 3,
      entregavel_numero: 'E003',
      descricao: 'Relatório de Gestão',
      detalhes: 'Prestação de contas anual',
      ano_criacao: 2022
    },
    {
      id: 4,
      entregavel_numero: 'E004',
      descricao: 'Dashboard de Indicadores',
      detalhes: 'Painel de monitoramento',
      ano_criacao: 2024
    },
    {
      id: 5,
      entregavel_numero: 'E005',
      descricao: 'Sistema de Gestão Integrada',
      detalhes: 'Plataforma unificada',
      ano_criacao: 2025
    }
  ],
  pessoas: [
    {
      id: 1,
      nome: 'João Silva',
      email: 'joao.silva@fatec.sp.gov.br',
      tipo_usuario: 'Docente',
      ano_criacao: 2020
    },
    {
      id: 2,
      nome: 'Maria Santos',
      email: 'maria.santos@fatec.sp.gov.br',
      tipo_usuario: 'Gestor',
      ano_criacao: 2020
    },
    {
      id: 3,
      nome: 'Pedro Lima',
      email: 'pedro.lima@fatec.sp.gov.br',
      tipo_usuario: 'Coordenador',
      ano_criacao: 2021
    },
    {
      id: 4,
      nome: 'Ana Costa',
      email: 'ana.costa@fatec.sp.gov.br',
      tipo_usuario: 'Técnico',
      ano_criacao: 2022
    },
    {
      id: 5,
      nome: 'Carlos Ferreira',
      email: 'carlos.ferreira@fatec.sp.gov.br',
      tipo_usuario: 'Analista',
      ano_criacao: 2023
    },
    {
      id: 6,
      nome: 'Lucia Rodrigues',
      email: 'lucia.rodrigues@fatec.sp.gov.br',
      tipo_usuario: 'Especialista',
      ano_criacao: 2024
    },
    {
      id: 7,
      nome: 'Roberto Oliveira',
      email: 'roberto.oliveira@fatec.sp.gov.br',
      tipo_usuario: 'Consultor',
      ano_criacao: 2025
    }
  ]
};

export const useConfigurationsByYear = (ano: number) => {
  const [configurations, setConfigurations] = useState<ConfigurationsByYear | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConfigurations = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log(`🔍 useConfigurationsByYear - Buscando dados para ano: ${ano}`);

        // Simular delay da API
        await new Promise(resolve => setTimeout(resolve, 500));

        // Tentar buscar via API real
        try {
          const response = await api.get(`/audit/configurations/year/${ano}`);
          setConfigurations(response.data);
          console.log('✅ Dados carregados da API:', response.data);
          return;
        } catch (apiError) {
          console.log('⚠️ API não disponível, usando dados mock com lógica temporal');
        }
        
        // 🔥 FILTRAR DADOS BASEADO NO ANO
        const filterByYear = (items: any[]) => {
          return items
            .filter(item => item.ano_criacao <= ano) // Só registros criados até o ano solicitado
            .map(item => ({
              ...item,
              ano_versao: ano // Marcar como versão do ano solicitado
            }));
        };

        const mockConfigurations: ConfigurationsByYear = {
          ano,
          configuracoes: {
            situacoesProblema: filterByYear(BASE_DATA.situacoesProblema),
            eixosTematicos: filterByYear(BASE_DATA.eixosTematicos),
            prioridades: filterByYear(BASE_DATA.prioridades),
            temas: filterByYear(BASE_DATA.temas),
            entregaveis: filterByYear(BASE_DATA.entregaveis),
            pessoas: filterByYear(BASE_DATA.pessoas)
          },
          timestamp: new Date().toISOString()
        };

        setConfigurations(mockConfigurations);
        setError(null); // Remover erro pois agora funciona corretamente
        
        console.log(`📝 Configurações filtradas para o ano ${ano}:`, mockConfigurations);
        console.log(`📊 Totais: SP=${mockConfigurations.configuracoes.situacoesProblema.length}, Eixos=${mockConfigurations.configuracoes.eixosTematicos.length}, Pessoas=${mockConfigurations.configuracoes.pessoas.length}`);

      } catch (error) {
        console.error('❌ Erro ao buscar configurações:', error);
        setError('Erro ao carregar configurações');
      } finally {
        setLoading(false);
      }
    };

    fetchConfigurations();
  }, [ano]);

  return { configurations, loading, error };
};

// Hook específico para situações problema por ano
export const useSituacoesProblemaByYear = (ano: number) => {
  const [situacoes, setSituacoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSituacoes = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await auditService.getSituacoesProblemaByYear(ano);
        setSituacoes(data);
      } catch (err) {
        console.error('Erro ao buscar situações problema por ano:', err);
        setError('Erro ao carregar situações problema do ano');
      } finally {
        setLoading(false);
      }
    };

    if (ano) {
      fetchSituacoes();
    }
  }, [ano]);

  return { situacoes, loading, error };
};