import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertCircle, CheckCircle, X, UserPlus, Users } from 'lucide-react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Modal } from '@/components/ui/modal';
import { useToast } from '@/components/ui/use-toast';
import { accessRequestService } from '@/services/commonServices';
import { SolicitacaoAcesso } from '@/types/api';
import { TipoUsuario } from '@/types/api';

interface PendingAccessRequestsTabProps {
  onRequestProcessed?: () => Promise<void>;
}

export const PendingAccessRequestsTab: React.FC<PendingAccessRequestsTabProps> = ({ 
  onRequestProcessed 
}) => {
  const { toast } = useToast();
  const [pendingRequests, setPendingRequests] = useState<SolicitacaoAcesso[]>([]);
  const [processedRequests, setProcessedRequests] = useState<SolicitacaoAcesso[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<SolicitacaoAcesso | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedTipoUsuario, setSelectedTipoUsuario] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'pending' | 'processed'>('pending');

  const tiposUsuarioDisponiveis = [
    { value: TipoUsuario.ADMINISTRADOR, label: 'Administrador', nivel: 1 },
    { value: TipoUsuario.CPS, label: 'CPS', nivel: 1 },
    { value: TipoUsuario.REGIONAL, label: 'Regional', nivel: 2 },
    { value: TipoUsuario.DIRETOR, label: 'Diretor', nivel: 2 },
    { value: TipoUsuario.COORDENADOR, label: 'Coordenador', nivel: 3 },
    { value: TipoUsuario.ADMINISTRATIVO, label: 'Administrativo', nivel: 3 },
    { value: TipoUsuario.DOCENTE, label: 'Docente', nivel: 4 }
  ];

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 PendingAccessRequests: Carregando solicitações...');
      
      const result = await accessRequestService.getAll();
      console.log('📥 PendingAccessRequests: Resultado recebido:', result);

      if (!result) {
        console.error('❌ Resultado é null ou undefined');
        setPendingRequests([]);
        setProcessedRequests([]);
        setError('Erro: resposta vazia do servidor');
        return;
      }

      let pendingReqs: SolicitacaoAcesso[] = [];
      if (result.pendingRequests) {
        if (Array.isArray(result.pendingRequests)) {
          pendingReqs = result.pendingRequests;
        } else {
          try {
            pendingReqs = [].concat(result.pendingRequests);
          } catch (e) {
            console.error('❌ Não foi possível converter pendingRequests para array');
          }
        }
      }

      let processedReqs: SolicitacaoAcesso[] = [];
      if (result.processedRequests) {
        if (Array.isArray(result.processedRequests)) {
          processedReqs = result.processedRequests;
        } else {
          try {
            processedReqs = [].concat(result.processedRequests);
          } catch (e) {
            console.error('❌ Não foi possível converter processedRequests para array');
          }
        }
      }
      
      console.log('✅ Arrays finais - Pendentes:', pendingReqs.length, 'Processadas:', processedReqs.length);

      setPendingRequests(pendingReqs);
      setProcessedRequests(processedReqs);
      
    } catch (err) {
      console.error('❌ Erro ao carregar solicitações:', err);
      setError('Erro ao carregar as solicitações de acesso');
      setPendingRequests([]);
      setProcessedRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenApproveModal = (request: SolicitacaoAcesso): void => {
    console.log('🔄 Abrindo modal para:', request);
    setSelectedRequest(request);
    setSelectedTipoUsuario('');
    setModalOpen(true);
  };

  const handleApproveRequest = async (): Promise<void> => {
    if (!selectedRequest) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Nenhuma solicitação selecionada'
      });
      return;
    }

    if (!selectedTipoUsuario) {
      toast({
        variant: 'destructive',
        title: 'Tipo de usuário obrigatório',
        description: 'Selecione um tipo de usuário para aprovar a solicitação'
      });
      return;
    }

    setIsProcessing(true);
    try {
      console.log('🚀 Enviando aprovação:', {
        id: selectedRequest.solicitacao_id,
        status: 'Aprovada',
        tipoUsuario: selectedTipoUsuario,
        unidadeId: selectedRequest.unidade_id
      });
      
      await accessRequestService.processRequest(
        selectedRequest.solicitacao_id,
        'Aprovada',
        selectedTipoUsuario,
        selectedTipoUsuario === 'Diretor' ? selectedRequest.unidade_id : undefined
      );
      
      toast({
        title: 'Solicitação aprovada',
        description: `Acesso aprovado para ${selectedRequest.nome}. Um email foi enviado com as credenciais.`
      });
      
      await loadRequests();
      if (onRequestProcessed) {
        await onRequestProcessed();
      }
      
      setModalOpen(false);
    } catch (err: any) {
      console.error('❌ Erro ao aprovar solicitação:', err);

      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        toast({
          variant: 'destructive',
          title: 'Erro de autenticação',
          description: 'Sua sessão pode ter expirado. Tente fazer login novamente em outra janela sem fechar esta.'
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Erro ao aprovar',
          description: 'Não foi possível processar a solicitação. Tente novamente.'
        });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectRequest = async (requestId: number): Promise<void> => {
    if (!confirm('Tem certeza que deseja rejeitar esta solicitação de acesso?')) {
      return;
    }
    
    try {
      await accessRequestService.processRequest(requestId, 'Rejeitada');
      
      toast({
        title: 'Solicitação rejeitada',
        description: 'A solicitação de acesso foi rejeitada com sucesso'
      });
      
      await loadRequests();
      
      if (onRequestProcessed) {
        await onRequestProcessed();
      }
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Erro ao rejeitar',
        description: 'Não foi possível processar a solicitação. Tente novamente.'
      });
      console.error('Erro ao rejeitar solicitação:', err);
    }
  };

  console.log('🔍 PendingAccessRequests render:', {
    loading,
    error,
    pendingRequestsLength: pendingRequests.length,
    activeTab,
    pendingRequests
  });

  if (error) {
    return (
      <div className="p-4 border border-red-200 bg-red-50 rounded-md mb-4">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
          <span className="text-red-800 font-medium">{error}</span>
        </div>
        <Button variant="outline" size="sm" className="mt-2" onClick={loadRequests}>
          Tentar novamente
        </Button>
      </div>
    );
  }

  return (
    <Card className="p-5 border border-gray-200 shadow-sm">
      <h3 className="text-md font-medium mb-4 text-gray-700 flex items-center">
        <Users className="h-5 w-5 mr-2 text-[#ae0f0a]" />
        Solicitações de Acesso
      </h3>

      {/* Sistema de abas simplificado */}
      <div className="flex border-b border-gray-200 mb-4">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'pending' 
              ? 'text-[#ae0f0a] border-b-2 border-[#ae0f0a]' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('pending')}
        >
          Pendentes ({pendingRequests.length})
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'processed' 
              ? 'text-[#ae0f0a] border-b-2 border-[#ae0f0a]' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('processed')}
        >
          Processadas ({processedRequests.length})
        </button>
      </div>

      {/* Conteúdo da aba Pendentes */}
      {activeTab === 'pending' && (
        <div className="pt-2">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ae0f0a] mx-auto mb-2"></div>
              <span>Carregando solicitações...</span>
            </div>
          ) : pendingRequests.length > 0 ? (
            <div className="overflow-x-auto rounded border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unidade</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pendingRequests.map((request) => (
                    <tr key={`pending-${request.solicitacao_id}`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{request.nome}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.unidade?.nome_unidade || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {request.data_solicitacao 
                          ? new Date(request.data_solicitacao).toLocaleDateString('pt-BR') 
                          : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button 
                          onClick={() => handleOpenApproveModal(request)}
                          className="bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 px-3 py-1 rounded mr-2"
                        >
                          Aprovar
                        </button>
                        <button 
                          onClick={() => handleRejectRequest(request.solicitacao_id)}
                          className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 px-3 py-1 rounded"
                        >
                          Rejeitar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Nenhuma solicitação pendente encontrada.
            </div>
          )}
        </div>
      )}

      {/* Conteúdo da aba Processadas */}
      {activeTab === 'processed' && (
        <div className="pt-2">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ae0f0a] mx-auto mb-2"></div>
              <span>Carregando solicitações...</span>
            </div>
          ) : processedRequests.length > 0 ? (
            <div className="overflow-x-auto rounded border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unidade</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {processedRequests.map((request) => (
                    <tr key={`processed-${request.solicitacao_id}`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{request.nome}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.unidade?.nome_unidade || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          request.status === 'Aprovada' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {request.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {request.data_processamento 
                          ? new Date(request.data_processamento).toLocaleDateString('pt-BR') 
                          : '-'
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-md border border-gray-100">
              <AlertCircle className="h-12 w-12 mx-auto mb-3 text-gray-400" />
              <p className="text-gray-600 font-medium">Nenhuma solicitação processada</p>
              <p className="text-gray-500 text-sm mt-1">
                As solicitações aprovadas ou rejeitadas aparecerão aqui.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Modal para aprovar solicitação - AJUSTADO PARA SER MENOR E CENTRALIZADO */}
      {modalOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-medium text-lg">Aprovar Solicitação de Acesso</h3>
              <button 
                onClick={() => setModalOpen(false)} 
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                <div className="grid gap-2">
                  <p><strong>Nome:</strong> {selectedRequest.nome}</p>
                  <p><strong>Email:</strong> {selectedRequest.email}</p>
                  <p><strong>Unidade:</strong> {selectedRequest.unidade?.nome_unidade || `Unidade #${selectedRequest.unidade_id}`}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm font-medium">Selecione o tipo de acesso</div>
                  <Select 
                    value={selectedTipoUsuario} 
                    onValueChange={setSelectedTipoUsuario}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um nível de acesso" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {tiposUsuarioDisponiveis.map((tipo) => (
                          <SelectItem key={tipo.value} value={tipo.value}>
                            {tipo.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex justify-end gap-3 mt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setModalOpen(false)}
                    disabled={isProcessing}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleApproveRequest}
                    disabled={!selectedTipoUsuario || isProcessing}
                    className="bg-[#ae0f0a] hover:bg-[#8e0c08]"
                  >
                    {isProcessing ? "Processando..." : "Confirmar Aprovação"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};