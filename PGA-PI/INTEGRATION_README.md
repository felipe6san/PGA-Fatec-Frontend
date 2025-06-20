# PGA FATEC - Integração Frontend-Backend


## 🏗️ Arquitetura da Integração

### 1. **Tipos TypeScript (`src/types/api.ts`)**
Interface completa baseada no schema Prisma do backend:

```typescript
// Principais entidades
- User (TipoUsuario: ADMINISTRADOR, GESTOR, DOCENTE, FUNCIONARIO)
- EixoTematico (eixos temáticos do PGA)
- PrioridadeAcao (prioridades de ação)
- Tema (temas específicos)
- AcaoProjeto (projetos/ações principais)
- Attachment1 (anexos dos projetos)

// Enums
- AnexoProjetoUm (ANEXO1, ANEXO2, ANEXO3, ANEXO4)
- StatusVerificacao (PENDENTE, OK, REQUER_ACAO)

// DTOs para operações CRUD
- CreateAttachment1Dto, UpdateAttachment1Dto
- CreateProject1Dto, UpdateProject1Dto
```

### 2. **Camada de Serviços**

#### **Projetos** (`src/features/projects/services/projectService.ts`)
```typescript
import { projectService } from '@/features/projects/services/projectService';

// Operações disponíveis
const projetos = await projectService.getAll();
const projeto = await projectService.getById(id);
const novoProjeto = await projectService.create(dadosProjeto);
const projetoAtualizado = await projectService.update(id, novosDados);
await projectService.delete(id);
```

#### **Anexos** (`src/features/anexos/services/anexoService.ts`)
```typescript
import { anexoService } from '@/features/anexos/services/anexoService';

// Operações disponíveis
const anexos = await anexoService.getAll();
const anexo = await anexoService.getById(id);
const novoAnexo = await anexoService.create(dadosAnexo);
const anexoAtualizado = await anexoService.update(id, novosDados);
await anexoService.delete(id);
```

#### **Serviços Auxiliares** (`src/services/commonServices.ts`)
```typescript
import { 
  eixoTematicoService, 
  prioridadeAcaoService, 
  temaService, 
  userService 
} from '@/services/commonServices';

// Dados de apoio para formulários
const eixos = await eixoTematicoService.getAll();
const prioridades = await prioridadeAcaoService.getAll();
const temas = await temaService.getAll();
const usuarios = await userService.getAll();
```

### 3. **Hooks Personalizados** (`src/hooks/useApi.ts`)

#### Hook para API única:
```typescript
import { useApi } from '@/hooks/useApi';

function MeuComponente() {
  const { data: projetos, loading, error } = useApi(() => projectService.getAll());
  
  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;
  
  return <div>{/* Renderizar projetos */}</div>;
}
```

#### Hook para múltiplas APIs:
```typescript
import { useMultipleApi } from '@/hooks/useApi';

function Dashboard() {
  const { data, loading, errors } = useMultipleApi({
    projetos: () => projectService.getAll(),
    anexos: () => anexoService.getAll(),
    eixos: () => eixoTematicoService.getAll()
  });
  
  return (
    <div>
      <h3>Projetos: {data.projetos?.length || 0}</h3>
      <h3>Anexos: {data.anexos?.length || 0}</h3>
    </div>
  );
}
```

## 🎨 Componentes Integrados

### **Projects.tsx** - Lista de Projetos
**Funcionalidades:**
- ✅ Carregamento dinâmico de projetos da API
- ✅ Exibição em cards expansíveis
- ✅ Cálculo automático de progresso baseado em datas
- ✅ Informações de eixo temático e prioridade
- ✅ Seção de anexos/aquisições quando disponíveis
- ✅ Estados de loading, erro e lista vazia
- ✅ Tratamento de dados opcionais (datas, relacionamentos)

```typescript
// Uso direto dos tipos da API - sem conversões desnecessárias
const [projetos, setProjetos] = useState<AcaoProjeto[]>([]);

// Carregamento limpo e direto
const projetosData = await projectService.getAll();
setProjetos(projetosData);
```

### **AnexoForm.tsx** - Formulário de Anexos
**Funcionalidades:**
- ✅ Dropdown dinâmico com projetos da API
- ✅ Validação completa do formulário
- ✅ Formatação automática de valores monetários
- ✅ Integração com diferentes tipos de anexo (1, 2, 3, 4)
- ✅ Redirecionamento após salvamento
- ✅ Tratamento de erros com feedback visual

```typescript
// Carregamento de projetos para o dropdown
const projetos = await projectService.getAll();

// Envio para API
await anexoService.create({
  item: values.item,
  projetoId: values.projetoId,
  denominacaoOuEspecificacao: values.denominacaoOuEspecificacao,
  quantidade: values.quantidade,
  precoTotalEstimado: parseFloat(precoValue),
  flag: anexoType as AnexoProjetoUm
});
```

## 🔗 Mapeamento de Endpoints

| Frontend Service | Backend Endpoint | Descrição |
|-----------------|------------------|-----------|
| `projectService` | `/project1` | Projetos/Ações do PGA |
| `anexoService` | `/attachment1` | Anexos dos projetos |
| `eixoTematicoService` | `/thematic-axis` | Eixos temáticos |
| `prioridadeAcaoService` | `/priority-action` | Prioridades de ação |
| `temaService` | `/themes` | Temas específicos |
| `userService` | `/users` | Usuários do sistema |

## 🛠️ Como Usar a Integração

### **1. Configuração**
```bash
# Backend deve estar rodando na porta configurada
cd PGA-Backend
npm run start:dev

# Frontend
cd PGA-PI
npm run dev
```

### **2. Criar um Novo Projeto**
```typescript
import { projectService } from '@/features/projects/services/projectService';

const novoProjeto = await projectService.create({
  pga_id: 1,
  eixo_id: 2,
  prioridade_id: 1,
  tema: "Modernização dos Laboratórios",
  o_que_sera_feito: "Atualizar equipamentos de informática...",
  por_que_sera_feito: "Equipamentos defasados...",
  data_inicio: "2024-01-01",
  data_final: "2024-12-31",
  obrigatorio_inclusao: false,
  obrigatorio_sustentabilidade: true
});
```

### **3. Criar um Anexo**
```typescript
import { anexoService } from '@/features/anexos/services/anexoService';

const novoAnexo = await anexoService.create({
  item: "Computadores Desktop",
  projetoId: "1",
  denominacaoOuEspecificacao: "Computadores de alta performance...",
  quantidade: 30,
  precoTotalEstimado: 45000.00,
  flag: AnexoProjetoUm.ANEXO1
});
```

### **4. Carregar Dados de Apoio**
```typescript
import { eixoTematicoService, prioridadeAcaoService } from '@/services/commonServices';

// Para popular dropdowns em formulários
const eixos = await eixoTematicoService.getAll();
const prioridades = await prioridadeAcaoService.getAll();
```

## 🎛️ Tratamento de Estados

### **Loading States**
```typescript
if (loading) {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="text-lg">Carregando projetos...</div>
    </div>
  );
}
```

### **Error States**
```typescript
if (error) {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="text-lg text-red-600">{error}</div>
    </div>
  );
}
```

### **Empty States**
```typescript
{projetos.length > 0 ? (
  // Renderizar lista
) : (
  <div className="text-center py-8">
    <p className="text-gray-500 text-lg">Nenhum projeto encontrado</p>
    <p className="text-gray-400 text-sm mt-2">
      Verifique se o backend está rodando e se há projetos cadastrados
    </p>
  </div>
)}
```

## 🚀 Funcionalidades Implementadas

### ✅ **Completas e Testadas**
- **Listagem de Projetos** - Carregamento, exibição e expansão de detalhes
- **Criação de Anexos** - Formulário completo com validação
- **Carregamento de Dados Auxiliares** - Eixos, prioridades, temas, usuários
- **Estados de Interface** - Loading, erro, vazio
- **Tipagem TypeScript** - 100% tipado sem `any`
- **Tratamento de Erros** - Logs, feedback visual, fallbacks

### 🔄 **Em Desenvolvimento**
- Edição de projetos existentes
- Remoção de projetos e anexos
- Filtros e busca
- Paginação
- Cache de dados
- Otimizações de performance

## 🎯 Próximos Passos

1. **Implementar CRUD completo** para projetos (editar, deletar)
2. **Adicionar filtros e busca** na lista de projetos
3. **Implementar paginação** para grandes volumes de dados
4. **Adicionar validações avançadas** nos formulários
5. **Implementar cache** para otimizar requisições
6. **Adicionar notificações toast** para feedback do usuário
7. **Criar testes unitários** para componentes e serviços
8. **Implementar refresh automático** de dados