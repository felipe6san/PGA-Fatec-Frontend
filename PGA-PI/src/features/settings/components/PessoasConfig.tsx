import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "../../../components/ui/table";
import { Input } from "../../../components/ui/input";
import { Card } from "../../../components/ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Plus, Search, AlertCircle, UserPlus, UserRound } from "lucide-react";
import { Badge } from "../../../components/ui/badge";

interface Pessoa {
  id: number;
  nome: string;
  email: string;
  tipo: string;
}

export const PessoasConfig = () => {
  const [pessoas, setPessoas] = useState<Pessoa[]>([
    { id: 1, nome: "João Silva", email: "joao@fatec.sp.gov.br", tipo: "Docente" },
    { id: 2, nome: "Maria Santos", email: "maria@fatec.sp.gov.br", tipo: "Administrativo" },
    { id: 3, nome: "Pedro Oliveira", email: "pedro@fatec.sp.gov.br", tipo: "Docente" },
    { id: 4, nome: "Ana Rodrigues", email: "ana@fatec.sp.gov.br", tipo: "Gestor" },
    { id: 5, nome: "Carlos Pereira", email: "carlos@fatec.sp.gov.br", tipo: "Docente" },
  ]);
  
  const [novaPessoa, setNovaPessoa] = useState<Pessoa>({ 
    id: 0, nome: "", email: "", tipo: "Docente" 
  });
  
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddPessoa = () => {
    if (!novaPessoa.nome || !novaPessoa.email) {
      alert("Preencha o nome e o email");
      return;
    }

    if (!novaPessoa.email.includes("@")) {
      alert("Email inválido");
      return;
    }

    const id = pessoas.length > 0 ? Math.max(...pessoas.map(p => p.id)) + 1 : 1;
    setPessoas([...pessoas, { ...novaPessoa, id }]);
    setNovaPessoa({ id: 0, nome: "", email: "", tipo: "Docente" });
  };

  const handleRemovePessoa = (id: number) => {
    setPessoas(pessoas.filter(p => p.id !== id));
  };

  const tipos = ["Docente", "Administrativo", "Gestor"];
  
  const filteredPessoas = pessoas.filter(pessoa => 
    pessoa.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pessoa.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pessoa.tipo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTypeBadgeColor = (tipo: string) => {
    switch(tipo) {
      case "Docente": return "bg-blue-100 text-blue-800 border-blue-300";
      case "Administrativo": return "bg-green-100 text-green-800 border-green-300";
      case "Gestor": return "bg-purple-100 text-purple-800 border-purple-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <UserRound className="h-6 w-6 mr-2 text-[#ae0f0a]" />
            Gerenciar Pessoas
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Cadastre pessoas para atribuição em projetos e ações
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">{filteredPessoas.length} registros</span>
        </div>
      </div>

      {/* Formulário de cadastro */}
      <Card className="p-5 border border-gray-200 shadow-sm">
        <h3 className="text-md font-medium mb-4 text-gray-700 flex items-center">
          <UserPlus className="h-5 w-5 mr-2 text-[#ae0f0a]" />
          Adicionar Nova Pessoa
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
              Nome Completo
            </label>
            <Input
              id="nome"
              placeholder="Ex: João Silva"
              value={novaPessoa.nome}
              onChange={e => setNovaPessoa({ ...novaPessoa, nome: e.target.value })}
              className="w-full bg-white border-gray-300"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              E-mail
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Ex: joao@fatec.sp.gov.br"
              value={novaPessoa.email}
              onChange={e => setNovaPessoa({ ...novaPessoa, email: e.target.value })}
              className="w-full bg-white border-gray-300"
            />
          </div>
          
          <div>
            <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mb-1">
              Tipo
            </label>
            <Select
              value={novaPessoa.tipo}
              onValueChange={(value) => setNovaPessoa({ ...novaPessoa, tipo: value })}
            >
              <SelectTrigger className="w-full bg-white border-gray-300 text-gray-800">
                <SelectValue placeholder="Selecione um tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {tipos.map(tipo => (
                    <SelectItem key={tipo} value={tipo}>
                      {tipo}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button 
            onClick={handleAddPessoa} 
            className="bg-[#ae0f0a] hover:bg-[#910c08] text-white flex items-center"
          >
            <Plus className="h-4 w-4 mr-1" /> Adicionar Pessoa
          </Button>
        </div>
      </Card>
      
      {/* Lista de Pessoas */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-md font-medium text-gray-700">Pessoas Cadastradas</h3>
          
          <div className="relative w-64">
            <Input
              placeholder="Pesquisar pessoas..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-9 bg-white"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </div>
        
        <div className="border rounded-md shadow-sm bg-white overflow-hidden">
          {filteredPessoas.length > 0 ? (
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="w-24 text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPessoas
                  .sort((a, b) => a.nome.localeCompare(b.nome))
                  .map(pessoa => (
                    <TableRow key={pessoa.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium text-gray-700">
                        {pessoa.nome}
                      </TableCell>
                      <TableCell>{pessoa.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`${getTypeBadgeColor(pessoa.tipo)} font-semibold`}>
                          {pessoa.tipo}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleRemovePessoa(pessoa.id)}
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
                {searchTerm ? "Nenhuma pessoa encontrada com estes critérios." : "Não há pessoas cadastradas ainda."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};