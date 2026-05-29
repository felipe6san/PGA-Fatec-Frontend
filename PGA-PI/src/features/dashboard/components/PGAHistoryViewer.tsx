import React, { useState } from 'react';
import { Calendar, Clock, FileText, Users, AlertCircle, RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useConfigurationsByYear } from '@/hooks/useConfigurationsByYear';

interface PGAHistoryViewerProps {
  pgaId: number;
  ano: number;
}

export const PGAHistoryViewer: React.FC<PGAHistoryViewerProps> = ({ pgaId, ano }) => {
  const { configurations, loading, error } = useConfigurationsByYear(ano);
  const [selectedSection, setSelectedSection] = useState<string>('situacoesProblema');

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Clock className="h-6 w-6 animate-spin text-[#ae0f0a] mr-2" />
        <span>Carregando configurações de {ano}...</span>
      </div>
    );
  }

  if (!configurations) {
    return (
      <div className="text-center py-12">
        <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-500 mb-2">
          Não foi possível carregar as configurações
        </h3>
        <p className="text-gray-400 mb-4">
          As configurações para o ano {ano} não estão disponíveis no momento
        </p>
        <Button 
          variant="outline" 
          onClick={() => window.location.reload()}
          className="text-[#ae0f0a] border-[#ae0f0a] hover:bg-[#ae0f0a] hover:text-white"
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          Tentar Novamente
        </Button>
      </div>
    );
  }

  const sections = [
    { key: 'situacoesProblema', label: 'Situações Problema', icon: FileText },
    { key: 'eixosTematicos', label: 'Eixos Temáticos', icon: Calendar },
    { key: 'prioridades', label: 'Prioridades', icon: Clock },
    { key: 'temas', label: 'Temas', icon: FileText },
    { key: 'entregaveis', label: 'Entregáveis', icon: FileText },
    { key: 'pessoas', label: 'Pessoas', icon: Users },
  ];

  const currentData = configurations.configuracoes[selectedSection as keyof typeof configurations.configuracoes];

  return (
    <div className="space-y-6">
      {/* Header com indicador de erro */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <Calendar className="h-6 w-6 mr-2 text-[#ae0f0a]" />
            Configurações Históricas {ano}
          </h2>
          <p className="text-sm text-gray-500">
            Estado das configurações conforme registrado em {ano}
          </p>
          {error && (
            <div className="flex items-center mt-2 text-amber-600">
              <AlertCircle className="h-4 w-4 mr-1" />
              <span className="text-sm">{error}</span>
            </div>
          )}
        </div>
        <Badge variant="outline" className="font-medium">
          Snapshot: {new Date(configurations.timestamp).toLocaleDateString('pt-BR')}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navegação */}
        <div className="lg:col-span-1">
          <Card className="p-4">
            <h3 className="font-medium mb-3 flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Seções Disponíveis
            </h3>
            <nav className="space-y-1">
              {sections.map(section => {
                const Icon = section.icon;
                const count = configurations.configuracoes[section.key as keyof typeof configurations.configuracoes]?.length || 0;
                
                return (
                  <button
                    key={section.key}
                    onClick={() => setSelectedSection(section.key)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
                      selectedSection === section.key
                        ? 'bg-[#ae0f0a] text-white'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Icon className="h-4 w-4" />
                      <span className="text-sm font-medium">{section.label}</span>
                    </div>
                    <Badge 
                      variant={selectedSection === section.key ? "secondary" : "outline"}
                      className="ml-2"
                    >
                      {count}
                    </Badge>
                  </button>
                );
              })}
            </nav>
          </Card>
        </div>

        {/* Conteúdo */}
        <div className="lg:col-span-3">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium flex items-center">
                {React.createElement(sections.find(s => s.key === selectedSection)?.icon || FileText, {
                  className: "h-5 w-5 mr-2 text-[#ae0f0a]"
                })}
                {sections.find(s => s.key === selectedSection)?.label}
              </h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  {currentData?.length || 0} {currentData?.length === 1 ? 'registro' : 'registros'}
                </span>
                {ano !== new Date().getFullYear() && (
                  <Badge variant="outline" className="text-xs">
                    Histórico {ano}
                  </Badge>
                )}
              </div>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {currentData && currentData.length > 0 ? (
                currentData.map((item: any, index: number) => (
                  <div key={index} className="bg-gray-50 border border-gray-200 p-4 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        {/* Renderização específica por tipo */}
                        {selectedSection === 'situacoesProblema' && (
                          <>
                            <div className="font-medium text-gray-800 mb-1">
                              {item.codigo_categoria} - {item.descricao}
                            </div>
                            {item.fonte && (
                              <div className="text-sm text-gray-600">
                                <span className="font-medium">Fonte:</span> {item.fonte}
                              </div>
                            )}
                          </>
                        )}
                        
                        {selectedSection === 'eixosTematicos' && (
                          <>
                            <div className="font-medium text-gray-800 mb-1">
                              Eixo {item.numero}: {item.nome_eixo}
                            </div>
                            {item.descricao && (
                              <div className="text-sm text-gray-600">{item.descricao}</div>
                            )}
                          </>
                        )}
                        
                        {selectedSection === 'prioridades' && (
                          <>
                            <div className="font-medium text-gray-800 mb-1">
                              Grau {item.grau}: {item.descricao}
                            </div>
                            <div className="text-sm text-gray-600 mb-1">
                              <span className="font-medium">Tipo:</span> {item.tipo_gestao}
                            </div>
                            {item.detalhes && (
                              <div className="text-xs text-gray-500">{item.detalhes}</div>
                            )}
                          </>
                        )}
                        
                        {selectedSection === 'temas' && (
                          <>
                            <div className="font-medium text-gray-800 mb-1">
                              Tema {item.tema_num}: {item.descricao}
                            </div>
                            {item.eixo && (
                              <div className="text-sm text-gray-600">
                                <span className="font-medium">Eixo:</span> {item.eixo.nome_eixo}
                              </div>
                            )}
                          </>
                        )}
                        
                        {selectedSection === 'entregaveis' && (
                          <>
                            <div className="font-medium text-gray-800 mb-1">
                              {item.entregavel_numero}: {item.descricao}
                            </div>
                            {item.detalhes && (
                              <div className="text-sm text-gray-600">{item.detalhes}</div>
                            )}
                          </>
                        )}
                        
                        {selectedSection === 'pessoas' && (
                          <>
                            <div className="font-medium text-gray-800 mb-1">{item.nome}</div>
                            <div className="text-sm text-gray-600 mb-2">{item.email}</div>
                            <Badge variant="outline" className="text-xs">
                              {item.tipo_usuario}
                            </Badge>
                          </>
                        )}
                      </div>
                      
                      <div className="ml-4 text-right">
                        {item.ano_versao && (
                          <Badge variant="secondary" className="text-xs">
                            v{item.ano_versao}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">Nenhum registro encontrado</p>
                  <p className="text-gray-400 text-sm">
                    Não há dados disponíveis para {sections.find(s => s.key === selectedSection)?.label} em {ano}
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};