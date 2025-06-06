import { useState, useEffect } from "react";
import { Button } from "../../../components/ui/button";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "../../../components/ui/table";
import { Input } from "../../../components/ui/input";
import { Card } from "../../../components/ui/card";
import { Plus, Search, AlertCircle, AlertTriangle, Loader2 } from "lucide-react";
import { Badge } from "../../../components/ui/badge";
import { situacoesService } from "../services/situacoesService";
import { SituacaoProblema } from "@/types/api";
import { toast } from "@/components/ui/use-toast";
import { Modal } from "../../../components/ui/modal";
import { Trash2 } from "lucide-react";

export const SituacoesConfig = () => {
  const [situacoes, setSituacoes] = useState<SituacaoProblema[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [novaSituacao, setNovaSituacao] = useState<{ 
    pga_id: number;
    descricao: string;
    fonte: string;
  }>({ 
    pga_id: 1, // Valor padrão
    descricao: "",
    fonte: ""
  });
  
  const [searchTerm, setSearchTerm] = useState('');

  // Carrega dados iniciais
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const situacoesData = await situacoesService.getAll();
      setSituacoes(situacoesData);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      setError('Erro ao carregar dados. Verifique se o backend está rodando.');
      
      // Fallback para dados mock em caso de erro
      setSituacoes([
        {
          situacao_id: 1,
          pga_id: 1,
          descricao: "Metodologia de ensino, desempenho de alunos, evasão",
          fonte: "CPA"
        },
        {
          situacao_id: 2,
          pga_id: 1,
          descricao: "Manutenção e conservação predial",
          fonte: "Relatório Infraestrutura"
        },
        {
          situacao_id: 3,
          pga_id: 1,
          descricao: "Infraestrutura predial (espaços, sistemas)",
          fonte: "CEE"
        },
        {
          situacao_id: 4,
          pga_id: 1,
          descricao: "Infraestrutura laboratorial e ambientes de ensino",
          fonte: ""
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSituacao = async () => {
    if (!novaSituacao.descricao) {
      alert("Preencha a descrição da situação problema");
      return;
    }

    try {
      setLoadingAdd(true);
      
      const novaSituacaoCreated = await situacoesService.create({
        pga_id: novaSituacao.pga_id,
        descricao: novaSituacao.descricao,
        fonte: novaSituacao.fonte
      });
      
      setSituacoes([...situacoes, novaSituacaoCreated]);
      setNovaSituacao({ pga_id: 1, descricao: "", fonte: "" });
      
      toast({
        variant: "success",
        title: "Sucesso!",
        description: "Situação problema adicionada com sucesso.",
      });
      
    } catch (err) {
      console.error('Erro ao adicionar situação:', err);
      toast({
        variant: "destructive",
        title: "Erro ao adicionar situação",
        description: "Ocorreu um erro ao adicionar a situação problema. Tente novamente.",
      });
    } finally {
      setLoadingAdd(false);
    }
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [situacaoToDelete, setSituacaoToDelete] = useState<SituacaoProblema | null>(null);
  const [loadingRemove, setLoadingRemove] = useState(false);

  const handleRemoveSituacao = async (id: number) => {
    const situacao = situacoes.find(s => s.situacao_id === id);
    setSituacaoToDelete(situacao || null);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSituacaoToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!situacaoToDelete) return;
    
    try {
      setLoadingRemove(true);
      
      await situacoesService.delete(situacaoToDelete.situacao_id);
      setSituacoes(situacoes.filter(s => s.situacao_id !== situacaoToDelete.situacao_id));
      
      toast({
        variant: "success",
        title: "Situação removida",
        description: `"${situacaoToDelete.descricao}" foi removida com sucesso`,
      });
      
      handleCloseDeleteModal();
    } catch (err) {
      console.error('Erro ao remover situação:', err);
      toast({
        variant: "destructive",
        title: "Erro ao remover",
        description: "Não foi possível remover a situação. Tente novamente.",
      });
    } finally {
      setLoadingRemove(false);
    }
  };

  const filteredSituacoes = situacoes.filter(situacao => 
    situacao.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
    situacao.fonte?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-[#ae0f0a]" />
          <span className="text-lg text-gray-600">Carregando situações problema...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com indicador de erro */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <AlertTriangle className="h-6 w-6 mr-2 text-[#ae0f0a]" />
            Gerenciar Situações Problema
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Configure as situações problema que originam os projetos do PGA
          </p>
          {error && (
            <div className="flex items-center mt-2 text-amber-600">
              <AlertCircle className="h-4 w-4 mr-1" />
              <span className="text-sm">{error}</span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">{filteredSituacoes.length} registros</span>
        </div>
      </div>

      {/* Formulário de cadastro */}
      <Card className="p-5 border border-gray-200 shadow-sm">
        <h3 className="text-md font-medium mb-4 text-gray-700 flex items-center">
          <Plus className="h-5 w-5 mr-2 text-[#ae0f0a]" />
          Adicionar Nova Situação Problema
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-1">
              Descrição da Situação
            </label>
            <Input
              id="descricao"
              placeholder="Ex: Metodologia de ensino, desempenho de alunos, evasão"
              value={novaSituacao.descricao}
              onChange={e => setNovaSituacao({ ...novaSituacao, descricao: e.target.value })}
              className="w-full bg-white border-gray-300"
              disabled={loadingAdd}
            />
          </div>
          
          <div>
            <label htmlFor="fonte" className="block text-sm font-medium text-gray-700 mb-1">
              Fonte (opcional)
            </label>
            <Input
              id="fonte"
              placeholder="Ex: CPA, CEE, Relatório"
              value={novaSituacao.fonte}
              onChange={e => setNovaSituacao({ ...novaSituacao, fonte: e.target.value })}
              className="w-full bg-white border-gray-300"
              disabled={loadingAdd}
            />
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button 
            onClick={handleAddSituacao} 
            className="bg-[#ae0f0a] hover:bg-[#910c08] text-white flex items-center"
            disabled={loadingAdd}
          >
            {loadingAdd ? (
              <>
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                Adicionando...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-1" />
                Adicionar Situação
              </>
            )}
          </Button>
        </div>
      </Card>
      
      {/* Lista de Situações */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-md font-medium text-gray-700">Situações Problema Cadastradas</h3>
          
          <div className="relative w-64">
            <Input
              placeholder="Pesquisar situações..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-9 bg-white"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </div>
        
        <div className="border rounded-md shadow-sm bg-white overflow-hidden">
          {filteredSituacoes.length > 0 ? (
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="w-40">Fonte</TableHead>
                  <TableHead className="w-24 text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSituacoes.map(situacao => (
                  <TableRow key={situacao.situacao_id} className="hover:bg-gray-50">
                    <TableCell className="font-medium text-gray-700">
                      {situacao.descricao}
                    </TableCell>
                    <TableCell>
                      {situacao.fonte ? (
                        <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">
                          {situacao.fonte}
                        </Badge>
                      ) : (
                        <span className="text-gray-400 text-sm">Não informado</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleRemoveSituacao(situacao.situacao_id)}
                        className="bg-[#ae0f0a]/10 hover:bg-[#ae0f0a]/20 text-[#ae0f0a] border border-[#ae0f0a]/20"
                      >
                        Remover
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="py-8 text-center">
              <div className="flex justify-center mb-3">
                <AlertCircle className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-500">
                {searchTerm ? "Nenhuma situação problema encontrada com estes critérios." : "Não há situações problema cadastradas ainda."}
              </p>
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={showDeleteModal}
        onClose={handleCloseDeleteModal}
        title="Confirmar Remoção"
        className="max-w-md"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-center">
            <div className="bg-red-100 rounded-full p-3">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </div>

          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Esta ação não pode ser desfeita. A situação problema será removida permanentemente do sistema.
            </p>
          </div>
          
          {situacaoToDelete && (
            <div className="bg-gray-50 p-4 rounded-lg border">
              <div className="flex items-start gap-3">
                <div>
                  <p className="font-medium text-gray-900">{situacaoToDelete.descricao}</p>
                  <p className="text-sm text-gray-500">Situação Problema {situacaoToDelete.fonte && `• ${situacaoToDelete.fonte}`}</p>
                </div>
              </div>
            </div>
          )}

          <div className="text-center">
            <p className="text-sm font-medium text-gray-900">
              Tem certeza que deseja remover esta situação problema?
            </p>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button
              variant="outline"
              onClick={handleCloseDeleteModal}
              disabled={loadingRemove}
              className="min-w-[100px]"
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={loadingRemove}
              className="bg-[#ae0f0a] hover:bg-[#910c08] min-w-[100px]"
            >
              {loadingRemove ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Removendo...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remover
                </>
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};