import React, { useState, useEffect } from 'react';
import { Clock, User, FileText, Download, Search, Activity, TrendingUp, AlertCircle, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { auditService, ChangesReportResponse, AuditSummaryResponse } from '@/services/auditService';
import { useToast } from '@/components/ui/use-toast';

interface AuditHistoryConfigProps {
  selectedYear?: number;
}

export const AuditHistoryConfig: React.FC<AuditHistoryConfigProps> = ({ 
  selectedYear = new Date().getFullYear() 
}) => {
  const [loading, setLoading] = useState(true);
  const [changesReport, setChangesReport] = useState<ChangesReportResponse | null>(null);
  const [auditSummary, setAuditSummary] = useState<AuditSummaryResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [exportingReport, setExportingReport] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadAuditData();
  }, [selectedYear]);

  const loadAuditData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log(`📊 Carregando dados de auditoria para ${selectedYear}...`);

      // Buscar dados em paralelo
      const [changes, summary] = await Promise.all([
        auditService.getChangesReport(selectedYear),
        auditService.getAuditSummary(selectedYear - 2, selectedYear),
      ]);

      setChangesReport(changes);
      setAuditSummary(summary);

      console.log('✅ Dados de auditoria carregados:', { changes, summary });

    } catch (err) {
      console.error('❌ Erro ao carregar dados de auditoria:', err);
      setError('Erro ao carregar histórico de auditoria');
      
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar o histórico de auditoria. Usando dados de exemplo.",
      });

      // Fallback com dados mais realistas
      setChangesReport({
        ano: selectedYear,
        resumo: [
          {
            tabela: 'eixo_tematico',
            operacao: 'CREATE',
            count: 3,
            registros: [
              { registro_id: 10, data_operacao: new Date(), usuario: 'Admin', motivo: null },
              { registro_id: 11, data_operacao: new Date(), usuario: 'Admin', motivo: null },
              { registro_id: 12, data_operacao: new Date(), usuario: 'Admin', motivo: null }
            ]
          },
          {
            tabela: 'eixo_tematico',
            operacao: 'DELETE',
            count: 1,
            registros: [
              { registro_id: 9, data_operacao: new Date(), usuario: 'Admin', motivo: 'Duplicado removido' }
            ]
          },
          {
            tabela: 'situacao_problema',
            operacao: 'CREATE',
            count: 5,
            registros: [
              { registro_id: 1, data_operacao: new Date(), usuario: 'Admin', motivo: null }
            ]
          }
        ],
        total_operacoes: 9,
        timestamp: new Date(),
      });

    } finally {
      setLoading(false);
    }
  };

  // 🔥 IMPLEMENTAR EXPORTAÇÃO REAL
  const handleExportReport = async () => {
    if (!changesReport) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não há dados para exportar",
      });
      return;
    }

    try {
      setExportingReport(true);
      
      toast({
        title: "Exportando...",
        description: "Gerando relatório de auditoria...",
      });

      // Gerar dados para exportação
      const reportData = generateReportData(changesReport, auditSummary);
      
      // Opção 1: Exportar como CSV
      exportAsCSV(reportData, selectedYear);
      
      // Opção 2: Se você quiser JSON (alternativa)
      // exportAsJSON(changesReport, selectedYear);
      
      toast({
        title: "Sucesso! 📄",
        description: `Relatório de auditoria ${selectedYear} foi baixado com sucesso`,
      });

    } catch (error) {
      console.error('Erro ao exportar relatório:', error);
      toast({
        variant: "destructive",
        title: "Erro na exportação",
        description: "Falha ao gerar o arquivo do relatório",
      });
    } finally {
      setExportingReport(false);
    }
  };

  // Gerar dados estruturados para o relatório
  const generateReportData = (changes: ChangesReportResponse, summary: AuditSummaryResponse | null) => {
    const reportData = [];

    // Cabeçalho do relatório
    reportData.push([
      'RELATÓRIO DE AUDITORIA - PGA FATEC',
      '',
      '',
      '',
      '',
      '',
    ]);
    reportData.push([
      `Ano: ${changes.ano}`,
      `Total de Operações: ${changes.total_operacoes}`,
      `Gerado em: ${new Date().toLocaleString('pt-BR')}`,
      '',
      '',
      '',
    ]);
    reportData.push(['', '', '', '', '', '']); // Linha vazia

    // Cabeçalho da tabela
    reportData.push([
      'Seção',
      'Operação',
      'Quantidade',
      'Registro ID',
      'Usuário',
      'Data',
      'Motivo'
    ]);

    // Dados das operações
    changes.resumo.forEach(item => {
      if (item.registros.length === 0) {
        // Se não há registros detalhados, adicionar linha resumo
        reportData.push([
          getTableLabel(item.tabela),
          getOperationLabel(item.operacao),
          item.count.toString(),
          'N/A',
          'N/A',
          'N/A',
          'N/A'
        ]);
      } else {
        // Adicionar cada registro individual
        item.registros.forEach(registro => {
          reportData.push([
            getTableLabel(item.tabela),
            getOperationLabel(item.operacao),
            '1',
            registro.registro_id.toString(),
            registro.usuario,
            new Date(registro.data_operacao).toLocaleString('pt-BR'),
            registro.motivo || 'N/A'
          ]);
        });
      }
    });

    return reportData;
  };

  // Exportar como CSV
  const exportAsCSV = (data: string[][], year: number) => {
    const csvContent = data
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { 
      type: 'text/csv;charset=utf-8;' 
    });

    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `auditoria-pga-${year}-${new Date().getTime()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Exportar como JSON (alternativa)
  const exportAsJSON = (data: ChangesReportResponse, year: number) => {
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `auditoria-pga-${year}-${new Date().getTime()}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getOperationColor = (operacao: string) => {
    switch (operacao) {
      case 'CREATE': return 'bg-green-100 text-green-800 border-green-200';
      case 'UPDATE': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'DELETE': return 'bg-red-100 text-red-800 border-red-200';
      case 'ACTIVATE': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'DEACTIVATE': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'SNAPSHOT_CREATED': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getOperationLabel = (operacao: string) => {
    switch (operacao) {
      case 'CREATE': return 'Criação';
      case 'UPDATE': return 'Alteração';
      case 'DELETE': return 'Exclusão';
      case 'ACTIVATE': return 'Ativação';
      case 'DEACTIVATE': return 'Desativação';
      case 'SNAPSHOT_CREATED': return 'Snapshot';
      default: return operacao;
    }
  };

  const getTableLabel = (tabela: string) => {
    switch (tabela) {
      case 'situacao_problema': return 'Situações Problema';
      case 'eixo_tematico': return 'Eixos Temáticos';
      case 'prioridade_acao': return 'Prioridades de Ação';
      case 'tema': return 'Temas';
      case 'entregavel_link_sei': return 'Entregáveis';
      case 'pessoa': return 'Pessoas';
      case 'pga': return 'PGA';
      default: return tabela.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-[#ae0f0a]" />
          <span className="text-lg text-gray-600">Carregando dados de auditoria...</span>
        </div>
      </div>
    );
  }

  // Calcular estatísticas dos dados reais
  const totalOperacoes = changesReport?.total_operacoes || 0;
  const operacoesPorTipo = changesReport?.resumo.reduce((acc, item) => {
    acc[item.operacao] = (acc[item.operacao] || 0) + item.count;
    return acc;
  }, {} as Record<string, number>) || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center pt-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <Activity className="h-6 w-6 mr-2 text-[#ae0f0a]" />
            Histórico de Auditoria {selectedYear}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Acompanhe todas as mudanças nas configurações do sistema durante o ano de {selectedYear}
          </p>
          {error && (
            <div className="flex items-center mt-2 text-amber-600">
              <AlertCircle className="h-4 w-4 mr-1" />
              <span className="text-sm">{error}</span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-3">
          <div className="text-sm text-gray-600 flex items-center space-x-1">
            <TrendingUp className="h-4 w-4" />
            <span>{totalOperacoes} operações registradas</span>
          </div>
          
          {/* Botão de refresh */}
          <Button variant="outline" size="sm" onClick={loadAuditData} disabled={loading}>
            <Activity className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Resumo Geral da Auditoria */}
      {auditSummary && (
        <Card className="p-6 border-l-4 border-l-[#ae0f0a]">
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-[#ae0f0a]" />
            Resumo Geral ({auditSummary.periodo.inicio} - {auditSummary.periodo.fim})
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {auditSummary.anos.map(ano => (
              <div key={ano.ano} className="bg-gray-50 p-4 rounded-lg border">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#ae0f0a]">{ano.ano}</div>
                  <div className="text-sm text-gray-500">{ano.total_operacoes} operações</div>
                </div>
                
                <div className="mt-3 space-y-1">
                  {Object.entries(ano.operacoes_por_tipo).map(([operacao, count]) => (
                    <div key={operacao} className="flex justify-between text-xs">
                      <span>{getOperationLabel(operacao)}:</span>
                      <span className="font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Resumo do Ano Específico */}
      <Card className="p-6 border-l-4 border-l-[#ae0f0a]">
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <FileText className="h-5 w-5 mr-2 text-[#ae0f0a]" />
          Resumo de Atividades - {selectedYear}
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-green-50 p-4 rounded-lg text-center border border-green-200">
            <div className="text-2xl font-bold text-green-600">
              {operacoesPorTipo.CREATE || 0}
            </div>
            <div className="text-sm text-green-700">Criações</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg text-center border border-blue-200">
            <div className="text-2xl font-bold text-blue-600">
              {operacoesPorTipo.UPDATE || 0}
            </div>
            <div className="text-sm text-blue-700">Alterações</div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg text-center border border-red-200">
            <div className="text-2xl font-bold text-red-600">
              {operacoesPorTipo.DELETE || 0}
            </div>
            <div className="text-sm text-red-700">Exclusões</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg text-center border border-gray-200">
            <div className="text-2xl font-bold text-gray-600">{totalOperacoes}</div>
            <div className="text-sm text-gray-700">Total</div>
          </div>
        </div>
      </Card>

      {/* Lista de Operações por Tabela */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium flex items-center">
            <Search className="h-5 w-5 mr-2 text-[#ae0f0a]" />
            Operações por Seção
          </h3>
          
          {/* 🔥 BOTÃO DE EXPORTAÇÃO ATUALIZADO */}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExportReport}
            disabled={exportingReport || !changesReport}
          >
            {exportingReport ? (
              <>
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                Exportando...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-1" />
                Exportar CSV
              </>
            )}
          </Button>
        </div>

        <div className="space-y-4">
          {changesReport?.resumo?.map((item, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <Badge variant="outline" className="font-medium">
                    {getTableLabel(item.tabela)}
                  </Badge>
                  <Badge className={`${getOperationColor(item.operacao)} border`}>
                    {getOperationLabel(item.operacao)}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {item.count} {item.count === 1 ? 'operação' : 'operações'}
                  </span>
                </div>
                <div className="text-xs text-gray-400">
                  {item.registros.length > 0 && new Date(item.registros[0].data_operacao).toLocaleDateString('pt-BR')}
                </div>
              </div>

              {/* Lista dos registros afetados */}
              {item.registros.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs font-medium text-gray-700 mb-2">
                    {item.operacao === 'CREATE' && '🆕 Registros criados:'}
                    {item.operacao === 'UPDATE' && '📝 Registros alterados:'}
                    {item.operacao === 'DELETE' && '🗑️ Registros removidos:'}
                  </div>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {item.registros.slice(0, 5).map((registro, regIndex) => (
                      <div key={regIndex} className="flex justify-between items-center text-xs">
                        <span className="font-mono">ID: {registro.registro_id}</span>
                        <span className="text-gray-500 flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          {registro.usuario}
                        </span>
                        <span className="text-gray-400">
                          {new Date(registro.data_operacao).toLocaleString('pt-BR')}
                        </span>
                      </div>
                    ))}
                    {item.registros.length > 5 && (
                      <div className="text-xs text-gray-500 text-center pt-1">
                        +{item.registros.length - 5} registro(s) adicional(is)...
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )) || []}
        </div>

        {(!changesReport?.resumo || changesReport.resumo.length === 0) && !loading && (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-500 mb-2">
              Nenhuma operação registrada
            </h4>
            <p className="text-gray-400">
              Nenhuma operação de auditoria foi encontrada para o ano de {selectedYear}
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Tente adicionar ou remover um eixo temático para ver as operações sendo registradas
            </p>
          </div>
        )}
      </Card>

      {/* Card adicional com métricas */}
      <Card className="p-6 bg-gradient-to-r from-[#ae0f0a]/5 to-[#ae0f0a]/10">
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <Clock className="h-5 w-5 mr-2 text-[#ae0f0a]" />
          Informações do Sistema
        </h3>
        
        <div className="space-y-3 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-[#ae0f0a]"></div>
            <span>Todas as operações são registradas automaticamente pelo sistema</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-[#ae0f0a]"></div>
            <span>Os logs de auditoria são mantidos por 5 anos para fins de conformidade</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-[#ae0f0a]"></div>
            <span>Snapshots automáticos são criados no início de cada ano letivo</span>
          </div>
          {changesReport && (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-[#ae0f0a]"></div>
              <span>Última atualização: {new Date(changesReport.timestamp).toLocaleString('pt-BR')}</span>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};