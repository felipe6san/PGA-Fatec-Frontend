<br id="topo">
<div align="center">
  
![banner](https://i.imgur.com/FyxzavU.png)

</div>

<div align="center">

[![Version](https://img.shields.io/badge/Version-1.0.0-blue.svg)](https://github.com/vfavretto/PGA-Fatec-Frontend/releases) 
[![Language](https://img.shields.io/badge/Language-TypeScript%20%7C%20React-yellow.svg)](https://www.typescriptlang.org/) 
[![Linting](https://img.shields.io/badge/Linting-eslint%20%7C%20prettier-green.svg)](https://eslint.org/) 
[![Build Tool](https://img.shields.io/badge/Build%20Tool-Vite-blueviolet)](https://vitejs.dev/) 
[![Framework](https://img.shields.io/badge/Framework-React-teal)](https://react.dev/) 
[![CSS Framework](https://img.shields.io/badge/CSS%20Framework-Tailwind%20CSS-indigo)](https://tailwindcss.com/) 

</div>

<p align="center">
    <a href="#sobre">Sobre</a>  |  
    <a href="#mer">MER & Requisitos</a>  |  
    <a href="#prototipos">Protótipos & Documentação</a>  |  
    <a href="#tecnologias">Tecnologias</a>  |  
    <a href="#equipe">Equipe</a>
</p>

<span id="sobre">
  
## :page_facing_up: Sobre o Projeto
  Projeto de plataforma digital que centraliza e facilita o Planejamento de Gestão Anual (PGA) das Faculdades de Tecnologia (Fatecs), promovendo uma gestão mais eficiente, organizada e colaborativa. A plataforma permite que as equipes gestoras registrem, monitorem e avaliem ações e projetos estratégicos, alinhando-os às prioridades institucionais do Centro Paula Souza e às demandas locais da unidade. A inclusão de diferentes atores, como coordenadores, docentes e parceiros, amplia o alcance do projeto, transformando-o em um hub abrangente para a integração de esforços em prol da excelência acadêmica, inovação e responsabilidade social. O PGA Digital não apenas simplifica processos, mas aspira a ser um catalisador para transformações positivas no ecossistema educacional, unindo diversos agentes para enfrentar os desafios contemporâneos de maneira colaborativa e inovadora.

### :link: Projeto disponível para visualização em [Plano de Gestão Anual Fatec](https://vfavretto.github.io/PGA-Fatec-Frontend/).

→ [Voltar ao topo](#topo)

<span id="mer">
  
## :bookmark_tabs: MER e Requisitos

<details>
   <summary>Clique aqui para visualizar o MER</summary>
    <br>
    <div align="center">
    <img src="https://i.imgur.com/aW09a8m.png" alt="MER">
    </div>
</details>

## 🎯 Requisitos Funcionais
 
### RF001 - Gerenciamento de Usuários
- **Descrição**: O sistema deve permitir o cadastro, atualização e gerenciamento de usuários
- **Funcionalidades**:
  - Cadastro de usuários com nome, email, nome de usuário
  - Autenticação segura com JWT
  - Diferentes níveis de acesso baseados no tipo de usuário
 
### RF002 - Gerenciamento de Unidades
- **Descrição**: O sistema deve gerenciar unidades educacionais (FATEC)
- **Funcionalidades**:
  - Cadastro de unidades com código FNNN único
  - Registro do nome completo da unidade
  - Registro do diretor responsável
  - Vinculação de cursos à unidade
 
### RF003 - Gerenciamento de PGA (Plano de Gestão Anual)
- **Descrição**: Controle completo do ciclo de vida dos planos de gestão
- **Funcionalidades**:
  - Criação de PGA por unidade e ano
  - Controle de versões do plano
  - Análise de cenário contextual
  - Datas de elaboração e parecer GPR
  - Status de acompanhamento
 
### RF004 - Gerenciamento de Situações Problema
- **Descrição**: Identificação e registro de problemas institucionais
- **Funcionalidades**:
  - Registro de situações-problema identificadas
  - Descrição detalhada das situações
  - Identificação das fontes dos problemas
  - Vinculação ao PGA correspondente
 
### RF005 - Gerenciamento de Eixos Temáticos e Temas
- **Descrição**: Organização temática das ações e projetos
- **Funcionalidades**:
  - Cadastro de eixos temáticos numerados
  - Definição de temas dentro de cada eixo
  - Descrições detalhadas dos eixos e temas
  - Estrutura hierárquica eixo-tema
 
### RF006 - Gerenciamento de Prioridades de Ação
- **Descrição**: Classificação de prioridades para ações e projetos
- **Funcionalidades**:
  - Definição de graus de prioridade
  - Classificação por tipo de gestão
  - Descrições e detalhes das prioridades
  - Vinculação às ações/projetos
 
### RF007 - Gerenciamento de Ações e Projetos
- **Descrição**: Planejamento e acompanhamento de ações/projetos
- **Funcionalidades**:
  - Definição do que será feito e por que será feito
  - Datas de início e fim planejadas
  - Referência a objetivos institucionais
  - Marcação de obrigatoriedades (inclusão, sustentabilidade)
  - Vinculação a eixos temáticos, temas e prioridades
  - Sistema de anexos para documentação
 
### RF008 - Gerenciamento de Equipes de Projeto
- **Descrição**: Gestão de pessoas envolvidas nos projetos
- **Funcionalidades**:
  - Vinculação de pessoas aos projetos
  - Definição de papéis (coordenador, participante, etc.)
  - Registro de carga horária semanal
  - Controle de tipos de vínculo HAE (Hora-Atividade Específica)
 
### RF009 - Gerenciamento de Etapas e Entregas
- **Descrição**: Controle de etapas e entregáveis dos projetos
- **Funcionalidades**:
  - Definição de etapas dos processos
  - Vinculação a entregáveis específicos
  - Links para documentos no SEI
  - Datas de verificação previstas e realizadas
  - Status de verificação (Pendente, Em Andamento, Concluído)
 
### RF010 - Gerenciamento de Aquisições
- **Descrição**: Controle de aquisições necessárias para projetos
- **Funcionalidades**:
  - Registro de itens a serem adquiridos
  - Especificação de unidades de medida e quantidades
  - Justificativas para aquisições
  - Estimativas de valores unitários e totais
  - Classificação por tipo de anexo (Projeto, Material Permanente, Material de Consumo)
 
### RF011 - Gerenciamento de Ações CPA
- **Descrição**: Registro de ações específicas da CPA (Comissão Própria de Avaliação)
- **Funcionalidades**:
  - Descrição das ações CPA
  - Justificativas para as ações
  - Vinculação ao PGA correspondente
 
### RF012 - Gerenciamento de Rotinas Institucionais
- **Descrição**: Controle de atividades rotineiras da instituição
- **Funcionalidades**:
  - Cadastro de rotinas por tipo
  - Atribuição de responsáveis e participantes
  - Registro de entregáveis esperados
  - Controle de status
 
### RF013 - Gerenciamento de Ocorrências de Rotinas
- **Descrição**: Registro de realizações das rotinas institucionais
- **Funcionalidades**:
  - Registro de datas de realização
  - Controle de horários
  - Definição de locais
  - Registro de pautas e resultados
  - Links para atas das reuniões
  - Status das ocorrências
 
### RF014 - Gerenciamento de Cursos
- **Descrição**: Controle dos cursos oferecidos pela unidade
- **Funcionalidades**:
  - Cadastro de cursos por unidade
  - Status dos cursos
  - Atribuição de coordenadores
 
### RF015 - Sistema de Autenticação e Autorização
- **Descrição**: Controle de acesso ao sistema
- **Funcionalidades**:
  - Login com usuário e senha
  - Autenticação JWT
  - Controle de sessões
  - Proteção de rotas baseada em roles

 
## 🔧 Requisitos Não Funcionais
 
### RNF001 - Segurança
- **Autenticação**: Uso de JWT (JSON Web Tokens) para autenticação
- **Criptografia**: Senhas armazenadas com hash bcrypt
- **Autorização**: Sistema baseado em roles e guards
- **Helmet**: Configuração de headers de segurança HTTP
- **Validação**: Validação rigorosa de entrada de dados
 
### RNF002 - Confiabilidade
- **Disponibilidade**: Sistema deve estar disponível 99.5% do tempo
- **Backup**: Backup automático do banco de dados
- **Recuperação**: Plano de recuperação de desastres
- **Monitoramento**: Logs detalhados para auditoria
 
### RNF003 - Usabilidade
- **Interface**: API RESTful bem documentada
- **Padronização**: Seguir padrões REST para endpoints
- **Documentação**: Documentação completa da API
- **Versionamento**: Controle de versão da API
 
### RNF004 - Portabilidade
- **Containerização**: Aplicação containerizada com Docker
- **Docker Compose**: Orquestração de serviços
- **Banco de Dados**: PostgreSQL containerizado
- **Ambientes**: Configuração para desenvolvimento, teste e produção
 
### RNF005 - Manutenibilidade
- **Arquitetura**: Arquitetura modular baseada em NestJS
- **Padrões**: Uso de design patterns (Repository, Service, DTO)
- **Testes**: Cobertura de testes unitários e e2e
- **Linting**: ESLint e Prettier para qualidade do código
- **TypeScript**: Tipagem estática para maior segurança
 
### RNF006 - Desenvolvimento
- **Framework**: NestJS com TypeScript
- **ORM**: Prisma ORM para abstração do banco
- **Validação**: Class-validator para validação de DTOs
- **Documentação**: Swagger/OpenAPI para documentação
- **Migrations**: Sistema de migrations do Prisma
 
### RNF007 - Qualidade
- **Padrões de Código**: ESLint configurado
- **Formatação**: Prettier para formatação consistente
- **CI/CD**: Pipeline de integração contínua

→ [Voltar ao topo](#topo)

<span id="prototipos">

## 💻 Protótipos e Documentação
  No planejamento do projeto, foram criados wireframes e mockups para a idealização do layout da interface. Após a validação pelo cliente, esses elementos foram implementados em um protótipo, permitindo a interação do usuário com a interface.
  
  Além disso, outras documentações, como fluxos de dados, modelagem do banco de dados e arquitetura do sistema, foram organizadas e compiladas em um [Documento](https://docs.google.com/document/d/1jA_Q3uX5fbNhBs4_swb11LFk14hEF6qx/edit).

## Protótipo de Alta Fidelidade

![Protótipo alta fidelidade](https://i.imgur.com/vqTm6Yx.png)

#### O Protótipo foi construido usando o [Figma](https://www.figma.com/design/fGjaMNQejB1JcliVylMCJf/PGA?node-id=7-5&t=uPFd3fqHqdSqladm-0)

→ [Voltar ao topo](#topo)

<span id="tecnologias">

## :open_file_folder: Tecnologias

|    Front-End     |     Back-End     | 
| :-----------: | :------------------------------------: | 
|![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)|![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)|
|![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)|![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)|
|![Figma](https://img.shields.io/badge/figma-%23F24E1E.svg?style=for-the-badge&logo=figma&logoColor=white)|![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)|

→ [Voltar ao topo](#topo)

<span id="equipe">

## :busts_in_silhouette: Equipe

|    Função     | Nome                                  |                                                                                                                                                      LinkedIn & GitHub                                                                                                                                                      |
| :-----------: | :------------------------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| Scrum Master | Victor Favretto           |     [![Linkedin Badge](https://img.shields.io/badge/Linkedin-blue?style=flat-square&logo=Linkedin&logoColor=white)](-) [![GitHub Badge](https://img.shields.io/badge/GitHub-111217?style=flat-square&logo=github&logoColor=white)](https://www.github.com/vfavretto)              |
| Product Owner  | Júlia Soares |      [![Linkedin Badge](https://img.shields.io/badge/Linkedin-blue?style=flat-square&logo=Linkedin&logoColor=white)](https://www.linkedin.com/in/julia-soares/) [![GitHub Badge](https://img.shields.io/badge/GitHub-111217?style=flat-square&logo=github&logoColor=white)](https://www.github.com/julinhaarte)     |
|   Dev Team    | Ana Laura Lazdenas               |         [![Linkedin Badge](https://img.shields.io/badge/Linkedin-blue?style=flat-square&logo=Linkedin&logoColor=white)](https://www.linkedin.com/in/ana-lazdenas/) [![GitHub Badge](https://img.shields.io/badge/GitHub-111217?style=flat-square&logo=github&logoColor=white)](https://github.com/ablazd) |
|   Dev Team    | Felipe Rodrigues                  |         [![Linkedin Badge](https://img.shields.io/badge/Linkedin-blue?style=flat-square&logo=Linkedin&logoColor=white)](x) [![GitHub Badge](https://img.shields.io/badge/GitHub-111217?style=flat-square&logo=github&logoColor=white)](https://github.com/felipe6san)        |
|   Dev Team    | Murilo Rodrigues                |   [![Linkedin Badge](https://img.shields.io/badge/Linkedin-blue?style=flat-square&logo=Linkedin&logoColor=white)](x) [![GitHub Badge](https://img.shields.io/badge/GitHub-111217?style=flat-square&logo=github&logoColor=white)](https://github.com/Zan-Kir)   |

→ [Voltar ao topo](#topo)
