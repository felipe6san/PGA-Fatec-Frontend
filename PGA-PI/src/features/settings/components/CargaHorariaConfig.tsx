import { useState, useEffect } from "react";
import { Button } from "../../../components/ui/button";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "../../../components/ui/table";
import { Input } from "../../../components/ui/input";
import { Card } from "../../../components/ui/card";
import { Plus, Search, AlertCircle, Clock, Loader2 } from "lucide-react";
import { Badge } from "../../../components/ui/badge";
import { cargaHorariaService } from "../services/cargaHorariaService";
import { TipoVinculoHAE } from "@/types/api";
import { toast } from "@/components/ui/use-toast";
import { Modal } from "../../../components/ui/modal";
import { Trash2, AlertTriangle } from "lucide-react";

export const CargaHorariaConfig = () => {
  const [cargaHorarias, setCargaHorarias] = useState<TipoVinculoHAE[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [novaCargaHoraria, setNovaCargaHoraria] = useState<{ 
    sigla: string; 
    descricao: string;
    detalhes: string;
  }>({ 
    sigla: "", 
    descricao: "",
    detalhes: ""
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
      
      const cargaHorariasData = await cargaHorariaService.getAll();
      setCargaHorarias(cargaHorariasData);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      setError('Erro ao carregar dados. Verifique se o backend está rodando.');
      
      // Fallback para dados mock em caso de erro
      setCargaHorarias([
        { id: 1, sigla: "HAE", descricao: "Hora Atividade Específica", detalhes: "" },
        { id: 2, sigla: "HAA", descricao: "Hora Atividade Acadêmica", detalhes: "" },
        { id: 3, sigla: "HAP", descricao: "Hora Atividade de Pesquisa", detalhes: "" },
        { id: 4, sigla: "H", descricao: "Hora <não tipificada>", detalhes: "" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCargaHoraria = async () => {
    if (!novaCargaHoraria.sigla || !novaCargaHoraria.descricao) {
      alert("Preencha a sigla e a descrição da carga horária");
      return;
    }

    // Verifica se já existe uma carga horária com a mesma sigla
    if (cargaHorarias.some(c => c.sigla === novaCargaHoraria.sigla)) {
      alert(`Já existe uma carga horária com a sigla ${novaCargaHoraria.sigla}`);
      return;
    }

    try {
      setLoadingAdd(true);
      
      const novaCargaHorariaCreated = await cargaHorariaService.create({
        sigla: novaCargaHoraria.sigla,
        descricao: novaCargaHoraria.descricao,
        detalhes: novaCargaHoraria.detalhes
      });
      
      setCargaHorarias([...cargaHorarias, novaCargaHorariaCreated]);
      setNovaCargaHoraria({ sigla: "", descricao: "", detalhes: "" });
      
      toast({
        variant: "success",
        title: "Carga horária adicionada",
        description: "O tipo de carga horária foi adicionado com sucesso.",
      });
      
    } catch (err) {
      console.error('Erro ao adicionar carga horária:', err);
      toast({
        variant: "destructive",
        title: "Erro ao adicionar carga horária", 
        description: "Ocorreu um erro ao tentar adicionar a carga horária. Tente novamente.",
      });
    } finally {
      setLoadingAdd(false);
    }
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [cargaToDelete, setCargaToDelete] = useState<TipoVinculoHAE | null>(null);
  const [loadingRemove, setLoadingRemove] = useState(false);

  const handleRemoveCargaHoraria = async (id: number) => {
    const carga = cargaHorarias.find(c => c.id === id);
    setCargaToDelete(carga || null);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setCargaToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!cargaToDelete) return;
    
    try {
      setLoadingRemove(true);
      
      await cargaHorariaService.delete(cargaToDelete.id);
      setCargaHorarias(cargaHorarias.filter(c => c.id !== cargaToDelete.id));
      
      toast({
        variant: "success",
        title: "Carga horária removida",
        description: "O tipo de carga horária foi removido com sucesso.",
      });
      
      handleCloseDeleteModal();
    } catch (err) {
      console.error('Erro ao remover carga horária:', err);
      toast({
        variant: "destructive",
        title: "Erro ao remover carga horária", 
        description: "Ocorreu um erro ao tentar remover a carga horária. Tente novamente.",
      });
    } finally {
      setLoadingRemove(false);
    }
  };

  const handleUpdateDetalhes = async (id: number, detalhes: string) => {
    try {
      const carga = cargaHorarias.find(c => c.id === id);
      if (!carga) return;

      await cargaHorariaService.update(id, { detalhes });
      
      setCargaHorarias(cargaHorarias.map(c => 
        c.id === id ? { ...c, detalhes } : c
      ));
    } catch (err) {
      console.error('Erro ao atualizar detalhes:', err);
    }
  };
  
  const filteredCargaHorarias = cargaHorarias.filter(carga => 
    carga.sigla.toLowerCase().includes(searchTerm.toLowerCase()) ||
    carga.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
    carga.detalhes?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-[#ae0f0a]" />
          <span className="text-lg text-gray-600">Carregando tipos de carga horária...</span>
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
            <Clock className="h-6 w-6 mr-2 text-[#ae0f0a]" />
            Gerenciar Tipos de Carga Horária
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Configure os tipos de carga horária que podem ser alocados em projetos
          </p>
          {error && (
            <div className="flex items-center mt-2 text-amber-600">
              <AlertCircle className="h-4 w-4 mr-1" />
              <span className="text-sm">{error}</span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">{filteredCargaHorarias.length} registros</span>
        </div>
      </div>

      {/* Formulário de cadastro */}
      <Card className="p-5 border border-gray-200 shadow-sm">
        <h3 className="text-md font-medium mb-4 text-gray-700 flex items-center">
          <Plus className="h-5 w-5 mr-2 text-[#ae0f0a]" />
          Adicionar Novo Tipo de Carga Horária
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label htmlFor="sigla" className="block text-sm font-medium text-gray-700 mb-1">
              Sigla
            </label>
            <Input
              id="sigla"
              placeholder="Ex: HAD"
              value={novaCargaHoraria.sigla}
              onChange={e => setNovaCargaHoraria({ ...novaCargaHoraria, sigla: e.target.value })}
              className="w-full bg-white border-gray-300"
              disabled={loadingAdd}
            />
          </div>
          
          <div className="md:col-span-2">
            <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <Input
              id="descricao"
              placeholder="Ex: Hora Atividade Docente"
              value={novaCargaHoraria.descricao}
              onChange={e => setNovaCargaHoraria({ ...novaCargaHoraria, descricao: e.target.value })}
              className="w-full bg-white border-gray-300"
              disabled={loadingAdd}
            />
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="detalhes" className="block text-sm font-medium text-gray-700 mb-1">
            Detalhes (opcional)
          </label>
          <textarea
            id="detalhes"
            placeholder="Detalhes sobre este tipo de carga horária..."
            value={novaCargaHoraria.detalhes || ""}
            onChange={e => setNovaCargaHoraria({ ...novaCargaHoraria, detalhes: e.target.value })}
            className="w-full resize-y bg-white border-gray-300"
            rows={2}
            disabled={loadingAdd}
          />
        </div>
        
        <div className="flex justify-end">
          <Button 
            onClick={handleAddCargaHoraria} 
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
                Adicionar Carga Horária
              </>
            )}
          </Button>
        </div>
      </Card>
      
      {/* Lista de Cargas Horárias */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-md font-medium text-gray-700">Tipos de Carga Horária Cadastrados</h3>
          
          <div className="relative w-64">
            <Input
              placeholder="Pesquisar carga horária..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-9 bg-white"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </div>
        
        <div className="border rounded-md shadow-sm bg-white overflow-hidden">
          {filteredCargaHorarias.length > 0 ? (
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="w-20">Sigla</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Detalhes</TableHead>
                  <TableHead className="w-24 text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCargaHorarias
                  .sort((a, b) => a.sigla.localeCompare(b.sigla))
                  .map(carga => (
                    <TableRow key={carga.id} className="hover:bg-gray-50">
                      <TableCell>
                        <Badge variant="outline" className="bg-gray-100 border-gray-300 text-gray-800 font-semibold">
                          {carga.sigla}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium text-gray-700">
                        {carga.descricao}
                      </TableCell>
                      <TableCell>
                        <textarea
                          value={carga.detalhes || ""}
                          onChange={(e) => handleUpdateDetalhes(carga.id, e.target.value)}
                          placeholder="Adicione detalhes sobre este tipo de carga horária..."
                          className="w-full resize-none min-h-[50px] text-sm bg-white border-gray-200"
                          rows={1}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleRemoveCargaHoraria(carga.id)}
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
                {searchTerm ? "Nenhum tipo de carga horária encontrado com estes critérios." : "Não há tipos de carga horária cadastrados ainda."}
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
              Esta ação não pode ser desfeita. O tipo de carga horária será removido permanentemente do sistema.
            </p>
          </div>
          
          {cargaToDelete && (
            <div className="bg-gray-50 p-4 rounded-lg border">
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="bg-gray-100 border-gray-300 text-gray-800 font-semibold">
                  {cargaToDelete.sigla}
                </Badge>
                <div>
                  <p className="font-medium text-gray-900">{cargaToDelete.descricao}</p>
                  <p className="text-sm text-gray-500">Tipo de Carga Horária</p>
                </div>
              </div>
            </div>
          )}

          <div className="text-center">
            <p className="text-sm font-medium text-gray-900">
              Tem certeza que deseja remover este tipo de carga horária?
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