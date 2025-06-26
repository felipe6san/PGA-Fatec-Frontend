import { useState, useEffect } from "react";
import { Button } from "../../../components/ui/button";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "../../../components/ui/table";
import { Input } from "../../../components/ui/input";
import { Badge } from "../../../components/ui/badge";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Card } from "../../../components/ui/card";
import { Modal } from "../../../components/ui/modal";
import { Plus, Search, AlertCircle, Loader2, RefreshCw, Trash2, AlertTriangle } from "lucide-react";
import { temasService } from "../services/temasService";
import { eixosService } from "../services/eixosService";
import { Tema, EixoTematico } from "@/types/api";
import { useToast } from "../../../components/ui/use-toast";

export const TemasConfig = () => {
  const [eixosTematicos, setEixosTematicos] = useState<EixoTematico[]>([]);
  const [temas, setTemas] = useState<Tema[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [loadingEixos, setLoadingEixos] = useState(false);
  const [loadingRemove, setLoadingRemove] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Estados do modal de confirmação
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [temaToDelete, setTemaToDelete] = useState<Tema | null>(null);
  
  const [novoTema, setNovoTema] = useState<{ 
    tema_num: number; 
    eixo_id: number; 
    descricao: string; 
  }>({ 
    tema_num: 0, 
    eixo_id: 0, 
    descricao: "" 
  });
  
  const [searchTerm, setSearchTerm] = useState('');

  // Carrega dados iniciais
  useEffect(() => {
    loadInitialData();
  }, []);

  // Atualiza eixos quando a janela ganha foco
  useEffect(() => {
    const handleFocus = () => {
      refreshEixosTematicos();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [temasData, eixosData] = await Promise.all([
        temasService.getAll(),
        eixosService.getAll()
      ]);
      
      setTemas(temasData);
      setEixosTematicos(eixosData);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      setError('Erro ao carregar dados. Tente novamente mais tarde.');
      
      // Fallback para dados mock em caso de erro
      setEixosTematicos([
        { eixo_id: 1, numero: 1, nome: "Didático-pedagógico" },
        { eixo_id: 2, numero: 2, nome: "Laboratórios - Ensino e Equipamentos Associados" },
        { eixo_id: 3, numero: 3, nome: "Pesquisa / Extensão e Equipamentos Associados" },
        { eixo_id: 4, numero: 4, nome: "Atividades Formativas em Projetos (nível tático)" },
        { eixo_id: 5, numero: 5, nome: "Infraestrutura (instalações prediais)" },
        { eixo_id: 6, numero: 6, nome: "Desenvolvimento de pessoas (docentes e servidores)" },
        { eixo_id: 7, numero: 7, nome: "Convênios e Parcerias Institucionais" },
        { eixo_id: 8, numero: 8, nome: "Implantação de UE / Cursos" },
        { eixo_id: 9, numero: 9, nome: "Gestão da Rotina Educacional" },
      ]);
      
      setTemas([
        { tema_id: 1, tema_num: 1, eixo_id: 1, descricao: "Adequação/reestruturação de PPC, implantação de novos cursos" },
        { tema_id: 2, tema_num: 2, eixo_id: 1, descricao: "Eventos e publicações acadêmicos e científicos" },
        { tema_id: 3, tema_num: 3, eixo_id: 1, descricao: "COIL/PCI e Escola de inovadores" },
        { tema_id: 4, tema_num: 4, eixo_id: 1, descricao: "Biblioteca Ativa e aquisição de bibliografias" },
        { tema_id: 5, tema_num: 5, eixo_id: 1, descricao: "Monitoria em disciplina do curso" },
        { tema_id: 6, tema_num: 6, eixo_id: 2, descricao: "Ações pedagógicas: visitas técnicas, projetos integradores" },
        { tema_id: 7, tema_num: 7, eixo_id: 3, descricao: "Divulgação do vestibular e fortalecimento de imagem institucional" },
        { tema_id: 8, tema_num: 15, eixo_id: 4, descricao: "Recursos humanos (auxiliar de docente)" },
        { tema_id: 9, tema_num: 99, eixo_id: 5, descricao: "Outra" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Nova função para atualizar apenas os eixos temáticos
  const refreshEixosTematicos = async () => {
    try {
      setLoadingEixos(true);
      const eixosData = await eixosService.getAll();
      setEixosTematicos(eixosData);
    } catch (err) {
      console.error('Erro ao atualizar eixos temáticos:', err);
      // Silencioso - não mostra erro pois é uma atualização em background
    } finally {
      setLoadingEixos(false);
    }
  };

  const handleAddTema = async () => {
    if (!novoTema.tema_num || !novoTema.eixo_id || !novoTema.descricao) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Preencha o número, eixo temático e descrição do tema",
      });
      return;
    }

    // Verifica se já existe um tema com o mesmo número e eixo temático
    if (temas.some(t => t.tema_num === novoTema.tema_num && t.eixo_id === novoTema.eixo_id)) {
      toast({
        variant: "destructive",
        title: "Tema já existe",
        description: `Já existe um tema com o número ${novoTema.tema_num} no mesmo eixo temático`,
      });
      return;
    }

    try {
      setLoadingAdd(true);
      
      const novoTemaCreated = await temasService.create({
        tema_num: novoTema.tema_num,
        eixo_id: novoTema.eixo_id,
        descricao: novoTema.descricao
      });
      
      setTemas([...temas, novoTemaCreated]);
      setNovoTema({ tema_num: 0, eixo_id: 0, descricao: "" });
      
      toast({
        variant: "success",
        title: "Tema adicionado!",
        description: `Tema "${novoTema.descricao}" foi adicionado com sucesso`,
      });
      
    } catch (err) {
      console.error('Erro ao adicionar tema:', err);
      toast({
        variant: "destructive",
        title: "Erro ao adicionar",
        description: "Não foi possível adicionar o tema. Tente novamente.",
      });
    } finally {
      setLoadingAdd(false);
    }
  };

  // Função para abrir o modal de confirmação
  const handleShowDeleteModal = (tema: Tema) => {
    setTemaToDelete(tema);
    setShowDeleteModal(true);
  };

  // Função para fechar o modal
  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setTemaToDelete(null);
  };

  // Função para confirmar a remoção
  const handleConfirmDelete = async () => {
    if (!temaToDelete) return;
    
    try {
      setLoadingRemove(true);
      
      await temasService.delete(temaToDelete.tema_id);
      setTemas(temas.filter(t => t.tema_id !== temaToDelete.tema_id));
      
      toast({
        variant: "success",
        title: "Tema removido",
        description: `"${temaToDelete.descricao}" foi removido com sucesso`,
      });
      
      handleCloseDeleteModal();
    } catch (err) {
      console.error('Erro ao remover tema:', err);
      toast({
        variant: "destructive",
        title: "Erro ao remover",
        description: "Não foi possível remover o tema. Tente novamente.",
      });
    } finally {
      setLoadingRemove(false);
    }
  };

  // Função para obter o número do eixo temático
  const getEixoNumero = (eixo_id: number): number => {
    const eixo = eixosTematicos.find(e => e.eixo_id === eixo_id);
    return eixo ? eixo.numero : 0;
  };

  // Função para obter o nome do eixo temático
  const getEixoNome = (eixo_id: number): string => {
    const eixo = eixosTematicos.find(e => e.eixo_id === eixo_id);
    return eixo ? eixo.nome : "Eixo não encontrado";
  };

  // Função para formatar o código do tema no formato "cat X.YY"
  const formatarCodigoTema = (eixo_id: number, tema_num: number): string => {
    const eixoNumero = getEixoNumero(eixo_id);
    return `cat ${eixoNumero}.${tema_num.toString().padStart(2, '0')}`;
  };

  // Filtragem de temas com base no termo de busca
  const filteredTemas = temas.filter(tema => 
    formatarCodigoTema(tema.eixo_id, tema.tema_num).toLowerCase().includes(searchTerm.toLowerCase()) ||
    getEixoNome(tema.eixo_id).toLowerCase().includes(searchTerm.toLowerCase()) ||
    tema.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-[#ae0f0a]" />
          <span className="text-lg text-gray-600">Carregando temas...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com indicador de erro */}
      <div className="flex justify-between items-center pt-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Gerenciar Temas</h2>
          <p className="text-sm text-gray-500 mt-1">
            Os temas são as categorias específicas de projetos vinculados a eixos temáticos.
          </p>
          {error && (
            <div className="flex items-center mt-2 text-amber-600">
              <AlertCircle className="h-4 w-4 mr-1" />
              <span className="text-sm">{error}</span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">{filteredTemas.length} registros</span>
        </div>
      </div>

      {/* Formulário de cadastro */}
      <Card className="p-5 border border-gray-200 shadow-sm">
        <h3 className="text-md font-medium mb-4 text-gray-700 flex items-center">
          <Plus className="h-5 w-5 mr-2 text-[#ae0f0a]" />
          Adicionar Novo Tema
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="eixo_id" className="block text-sm font-medium text-gray-700">
                Eixo Temático
              </label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={refreshEixosTematicos}
                disabled={loadingEixos}
                className="h-6 p-1 text-gray-500 hover:text-gray-700"
              >
                <RefreshCw className={`h-3 w-3 ${loadingEixos ? 'animate-spin' : ''}`} />
              </Button>
            </div>
            <Select
              value={novoTema.eixo_id ? novoTema.eixo_id.toString() : ""}
              onValueChange={(value) => setNovoTema({ ...novoTema, eixo_id: parseInt(value) })}
              disabled={loadingAdd || eixosTematicos.length === 0 || loadingEixos}
            >
              <SelectTrigger className="w-full bg-white border-gray-300 text-gray-800">
                <SelectValue placeholder={eixosTematicos.length === 0 ? "Nenhum eixo temático encontrado" : "Selecione um eixo temático"} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {eixosTematicos.map(eixo => (
                    <SelectItem key={eixo.eixo_id} value={eixo.eixo_id.toString()}>
                      {eixo.numero.toString().padStart(2, '0')} - {eixo.nome}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label htmlFor="tema_num" className="block text-sm font-medium text-gray-700 mb-1">
              Número do Tema
            </label>
            <Input
              id="tema_num"
              type="number"
              placeholder="Ex: 15"
              value={novoTema.tema_num || ""}
              onChange={e => setNovoTema({ ...novoTema, tema_num: parseInt(e.target.value) || 0 })}
              className="w-full bg-white border-gray-300"
              disabled={loadingAdd}
            />
          </div>
          
          <div className="md:col-span-1">
            <label htmlFor="preview" className="block text-sm font-medium text-gray-700 mb-1">
              Código (Visualização)
            </label>
            <div className="h-10 border border-gray-300 rounded-md flex items-center px-3 bg-gray-50 text-gray-500">
              {novoTema.eixo_id ? formatarCodigoTema(novoTema.eixo_id, novoTema.tema_num) : "Selecione um eixo"}
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-1">
            Descrição do Tema
          </label>
          <Input
            id="descricao"
            placeholder="Ex: Recursos humanos (auxiliar de docente)"
            value={novoTema.descricao}
            onChange={e => setNovoTema({ ...novoTema, descricao: e.target.value })}
            className="w-full bg-white border-gray-300"
            disabled={loadingAdd}
          />
        </div>
        
        <div className="flex justify-end">
          <Button 
            onClick={handleAddTema} 
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
                Adicionar Tema
              </>
            )}
          </Button>
        </div>
      </Card>
      
      {/* Lista de Temas */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-md font-medium text-gray-700">Temas Cadastrados</h3>
          
          <div className="relative w-64">
            <Input
              placeholder="Pesquisar temas..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-9 bg-white"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </div>
        
        <div className="border rounded-md shadow-sm bg-white overflow-hidden">
          {filteredTemas.length > 0 ? (
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="w-32">Código</TableHead>
                  <TableHead className="w-48">Eixo Temático</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="w-24 text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTemas
                  .sort((a, b) => {
                    const eixoA = getEixoNumero(a.eixo_id);
                    const eixoB = getEixoNumero(b.eixo_id);
                    if (eixoA !== eixoB) return eixoA - eixoB;
                    return a.tema_num - b.tema_num;
                  })
                  .map(tema => (
                    <TableRow key={tema.tema_id} className="hover:bg-gray-50">
                      <TableCell>
                        <Badge variant="outline" className="font-mono bg-blue-50 border-blue-200 text-blue-800 font-semibold">
                          {formatarCodigoTema(tema.eixo_id, tema.tema_num)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="font-mono bg-gray-100 border-gray-300 text-gray-800 font-semibold text-xs">
                            {getEixoNumero(tema.eixo_id).toString().padStart(2, '0')}
                          </Badge>
                          <span className="text-sm">{getEixoNome(tema.eixo_id)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-gray-700">
                        {tema.descricao}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleShowDeleteModal(tema)}
                          className="bg-[#ae0f0a]/10 hover:bg-[#ae0f0a]/20 text-[#ae0f0a] border border-[#ae0f0a]/20"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
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
                {searchTerm ? "Nenhum tema encontrado com estes critérios." : "Não há temas cadastrados ainda."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Confirmação de Remoção */}
      <Modal
        isOpen={showDeleteModal}
        onClose={handleCloseDeleteModal}
        title="Confirmar Remoção"
        className="max-w-md"
      >
        <div className="space-y-4">
          {/* Ícone de alerta */}
          <div className="flex items-center justify-center">
            <div className="bg-red-100 rounded-full p-3">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </div>

          {/* Descrição */}
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Esta ação não pode ser desfeita. O tema será removido permanentemente do sistema.
            </p>
          </div>
          
          {/* Preview do item a ser removido */}
          {temaToDelete && (
            <div className="bg-gray-50 p-4 rounded-lg border">
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="font-mono bg-blue-50 border-blue-200 text-blue-800 font-semibold">
                  {formatarCodigoTema(temaToDelete.eixo_id, temaToDelete.tema_num)}
                </Badge>
                <div>
                  <p className="font-medium text-gray-900">{temaToDelete.descricao}</p>
                  <p className="text-sm text-gray-500">Tema • {getEixoNome(temaToDelete.eixo_id)}</p>
                </div>
              </div>
            </div>
          )}

          <div className="text-center">
            <p className="text-sm font-medium text-gray-900">
              Tem certeza que deseja remover este tema?
            </p>
          </div>

          {/* Botões de ação */}
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