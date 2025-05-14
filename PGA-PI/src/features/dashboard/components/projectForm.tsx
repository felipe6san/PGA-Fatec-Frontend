import React, { useState } from "react";
import {
  PapelProjeto,
  TipoVinculoHAE,
  ProjetoPessoa,
  StatusVerificacao,
  EtapaProcesso,
  TipoAnexo,
  AquisicaoItem,
  EixoTematico,
  PrioridadeAcao
} from './projectFormTypes';

// --- Utility Functions ---
const formatCurrency = (value: string): string => {
  const number = parseFloat(value.replace(/[^\d]/g, '')) / 100;
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(number);
};

const parseCurrencyInput = (value: string): string => {
  return value.replace(/\D/g, '');
};

const mockPessoas = [
  { pessoaId: "1", nome: "João Silva (Docente)" },
  { pessoaId: "2", nome: "Maria Santos (Administrativo)" },
  { pessoaId: "3", nome: "Pedro Oliveira (Docente)" },
  { pessoaId: "4", nome: "Ana Costa (Gestor)" },
  { pessoaId: "5", nome: "Lucas Ferreira (Docente)" },
  { pessoaId: "6", nome: "Mariana Lima (Administrativo)" },
];

const mockEixosTematicos: EixoTematico[] = [
  { id: 1, numero: 1, nome: "Eixo 1: Ensino de Qualidade" },
  { id: 2, numero: 2, nome: "Eixo 2: Pesquisa e Inovação" },
  { id: 3, numero: 3, nome: "Eixo 3: Extensão e Comunidade" },
  { id: 4, numero: 4, nome: "Eixo 4: Gestão e Infraestrutura" },
];

const mockPrioridadesAcao: PrioridadeAcao[] = [
  { id: 1, grau: 1, descricao: "Prioridade Alta" },
  { id: 2, grau: 2, descricao: "Prioridade Média" },
  { id: 3, grau: 3, descricao: "Prioridade Baixa" },
];

const ProjectForm: React.FC = () => {
  const [tema, setTema] = useState<string>("");
  const [nomeProjeto, setNomeProjeto] = useState<string>("");
  const [ano, setAno] = useState<number>(new Date().getFullYear());
  const [origem, setOrigem] = useState<string>("");
  const [oQueSeraFeito, setOQueSeraFeito] = useState<string>("");
  const [porQueSeraFeito, setPorQueSeraFeito] = useState<string>("");
  const [dataInicio, setDataInicio] = useState<string>("");
  const [dataFinal, setDataFinal] = useState<string>("");
  const [custoEstimado, setCustoEstimado] = useState<string>("");
  const [fonteRecursos, setFonteRecursos] = useState<string>("");
  const [eixoId, setEixoId] = useState<string>("");
  const [prioridadeId, setPrioridadeId] = useState<string>("");
  const [objetivosInstitucionaisReferenciados, setObjetivosInstitucionaisReferenciados] = useState<string>("");
  const [obrigatorioInclusao, setObrigatorioInclusao] = useState<boolean>(false);
  const [obrigatorioSustentabilidade, setObrigatorioSustentabilidade] = useState<boolean>(false);
  const [pessoasProjeto, setPessoasProjeto] = useState<ProjetoPessoa[]>([
    { id: 0, pessoaId: "", nome: "", papel: PapelProjeto.Responsavel },
  ]);
  const [etapasProcesso, setEtapasProcesso] = useState<EtapaProcesso[]>([
    { id: 0, descricao: "", statusVerificacao: StatusVerificacao.Pendente },
  ]);
  const [situacaoProblema, setSituacaoProblema] = useState<string[]>([""]);
  const [aquisicoes, setAquisicoes] = useState<AquisicaoItem[]>([
  ]);

  const handleAddPessoaProjeto = (papel: PapelProjeto) => {
    setPessoasProjeto([
      ...pessoasProjeto,
      {
        id: pessoasProjeto.length,
        pessoaId: "",
        nome: "",
        papel: papel,
        ...(papel === PapelProjeto.Colaborador && { cargaHorariaSemanal: "", tipoVinculoHAE: "" }),
      },
    ]);
  };

  const handlePessoaProjetoChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    const newPessoasProjeto = [...pessoasProjeto];
    const currentPessoa = newPessoasProjeto[index];

    if (name === "pessoaId") {
      const selectedPessoa = mockPessoas.find(p => p.pessoaId === value);
      newPessoasProjeto[index] = {
        ...currentPessoa,
        pessoaId: value,
        nome: selectedPessoa?.nome || "",
      };
    } else {
      newPessoasProjeto[index] = { ...currentPessoa, [name]: value };
    }
    setPessoasProjeto(newPessoasProjeto);
  };

  const handleRemovePessoaProjeto = (index: number) => {
    const newPessoasProjeto = pessoasProjeto.filter((_, i) => i !== index);
    setPessoasProjeto(newPessoasProjeto);
  };

  const handleAddEtapaProcesso = () => {
    setEtapasProcesso([
      ...etapasProcesso,
      {
        id: etapasProcesso.length,
        descricao: "",
        statusVerificacao: StatusVerificacao.Pendente,
        entregavelLinkSei: "",
        numeroRef: "",
        dataVerificacaoPrevista: "",
        dataVerificacaoRealizada: "",
      },
    ]);
  };

  const handleEtapaProcessoChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    const newEtapasProcesso = [...etapasProcesso];
    newEtapasProcesso[index] = { ...newEtapasProcesso[index], [name]: value };
    setEtapasProcesso(newEtapasProcesso);
  };

  const handleRemoveEtapaProcesso = (index: number) => {
    const newEtapasProcesso = etapasProcesso.filter((_, i) => i !== index);
    setEtapasProcesso(newEtapasProcesso);
  };

  const handleAddSituacaoProblema = () => {
    setSituacaoProblema([...situacaoProblema, ""]);
  };

  const handleSituacaoProblemaChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newSituacaoProblema = [...situacaoProblema];
    newSituacaoProblema[index] = event.target.value;
    setSituacaoProblema(newSituacaoProblema);
  };

  const handleRemoveSituacaoProblema = (index: number) => {
    const newSituacaoProblema = situacaoProblema.filter((_, i) => i !== index);
    setSituacaoProblema(newSituacaoProblema);
  };

  const handleAddAquisicao = () => {
    setAquisicoes([
      ...aquisicoes,
      {
        id: aquisicoes.length,
        tipoAnexo: "",
        descricaoItem: "",
        unidadeMedida: "",
        quantidade: "1",
        justificativa: "",
        valorUnitarioEstimado: "0",
        valorTotalEstimado: "0",
      },
    ]);
  };

  const handleAquisicaoChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    const newAquisicoes = [...aquisicoes];
    let updatedAquisicao = { ...newAquisicoes[index], [name]: value };

    if (name === "quantidade" || name === "valorUnitarioEstimado") {
        const qtd = parseFloat(name === "quantidade" ? value : updatedAquisicao.quantidade) || 0;
        const valorUnit = parseFloat(name === "valorUnitarioEstimado" ? parseCurrencyInput(value) : parseCurrencyInput(updatedAquisicao.valorUnitarioEstimado || '0')) / 100;
        updatedAquisicao.valorTotalEstimado = (qtd * valorUnit).toFixed(2);
    }
    if (name === "valorUnitarioEstimado") {
        updatedAquisicao.valorUnitarioEstimado = parseCurrencyInput(value);
    }


    newAquisicoes[index] = updatedAquisicao;
    setAquisicoes(newAquisicoes);
  };

  const handleRemoveAquisicao = (index: number) => {
    const newAquisicoes = aquisicoes.filter((_, i) => i !== index);
    setAquisicoes(newAquisicoes);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const formData = {
      tema,
      eixoId: parseInt(eixoId) || null,
      prioridadeId: parseInt(prioridadeId) || null,
      oQueSeraFeito,
      porQueSeraFeito,
      dataInicio,
      dataFinal,
      objetivosInstitucionaisReferenciados,
      obrigatorioInclusao,
      obrigatorioSustentabilidade,
      pessoas: pessoasProjeto.map(p => ({
        pessoaId: p.pessoaId,
        papel: p.papel,
        cargaHorariaSemanal: p.cargaHorariaSemanal ? parseInt(p.cargaHorariaSemanal) : undefined,
        tipoVinculoHAE: p.tipoVinculoHAE
      })),
      etapas: etapasProcesso.map(e => ({
        ...e,
        dataVerificacaoPrevista: e.dataVerificacaoPrevista || null,
        dataVerificacaoRealizada: e.dataVerificacaoRealizada || null,
      })),
      aquisicoes: aquisicoes.map(a => ({
        ...a,
        quantidade: parseInt(a.quantidade) || 0,
        valorUnitarioEstimado: a.valorUnitarioEstimado ? parseFloat(a.valorUnitarioEstimado.replace(/[^\d]/g, '')) / 100 : undefined,
        valorTotalEstimado: a.valorTotalEstimado ? parseFloat(a.valorTotalEstimado.replace(/[^\d]/g, '')) / 100 : undefined,
      })),
      nomeProjeto,
      ano,
      origem,
      custoTotalEstimadoProjeto: custoEstimado ? parseFloat(parseCurrencyInput(custoEstimado)) / 100 : 0,
      fonteRecursos,
      situacoesProblema: situacaoProblema,
    };
    console.log("Form Data:", formData);
    //TODO Here you would typically send the form data to your backend
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 p-4 bg-white shadow-md rounded-lg"
    >
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Registro de Ação/Projeto
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="tema"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            ID/Tema do Projeto (Conforme PGA):
          </label>
          <input
            type="text"
            id="tema"
            value={tema}
            onChange={(e) => setTema(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label
            htmlFor="nomeProjeto"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Nome do Projeto (Opcional):
          </label>
          <input
            type="text"
            id="nomeProjeto"
            value={nomeProjeto}
            onChange={(e) => setNomeProjeto(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label
            htmlFor="ano"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Ano (PGA):
          </label>
          <input
            type="number"
            id="ano"
            value={ano}
            onChange={(e) => setAno(parseInt(e.target.value))}
            required
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label
            htmlFor="origem"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Origem da Demanda (Fonte da Situação Problema):
          </label>
          <select
            id="origem"
            value={origem}
            onChange={(e) => setOrigem(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white"
          >
            <option value="">Selecione a Origem</option>
            <option value="CPA">
              CPA (Relatório da Comissão Própria de Avaliação da Unidade)
            </option>
            <option value="Outra">Outra</option>
            <option value="CEE">
              CEE (Relatório Circunstanciado do Conselho Estadual de Educação)
            </option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="eixoId"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Eixo Temático:
          </label>
          <select
            id="eixoId"
            value={eixoId}
            onChange={(e) => setEixoId(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white"
          >
            <option value="">Selecione um Eixo Temático</option>
            {mockEixosTematicos.map((eixo) => (
              <option key={eixo.id} value={eixo.id}>
                {eixo.numero} - {eixo.nome}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="prioridadeId"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Prioridade da Ação:
          </label>
          <select
            id="prioridadeId"
            value={prioridadeId}
            onChange={(e) => setPrioridadeId(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white"
          >
            <option value="">Selecione a Prioridade</option>
            {mockPrioridadesAcao.map((prio) => (
              <option key={prio.id} value={prio.id}>
                {prio.grau} - {prio.descricao}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label
          htmlFor="oQueSeraFeito"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          O que será feito (Descrição da Ação/Projeto):
        </label>
        <textarea
          id="oQueSeraFeito"
          value={oQueSeraFeito}
          onChange={(e) => setOQueSeraFeito(e.target.value)}
          rows={3}
          required
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div>
        <label
          htmlFor="porQueSeraFeito"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Por que será feito (Justificativa da Ação/Projeto):
        </label>
        <textarea
          id="porQueSeraFeito"
          value={porQueSeraFeito}
          onChange={(e) => setPorQueSeraFeito(e.target.value)}
          rows={3}
          required
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div>
        <label
          htmlFor="objetivosInstitucionaisReferenciados"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Objetivos Institucionais Referenciados:
        </label>
        <textarea
          id="objetivosInstitucionaisReferenciados"
          value={objetivosInstitucionaisReferenciados}
          onChange={(e) => setObjetivosInstitucionaisReferenciados(e.target.value)}
          rows={3}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="obrigatorioInclusao"
              name="obrigatorioInclusao"
              type="checkbox"
              checked={obrigatorioInclusao}
              onChange={(e) => setObrigatorioInclusao(e.target.checked)}
              className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="obrigatorioInclusao" className="font-medium text-gray-700">
              Obrigatório Inclusão?
            </label>
            <p className="text-gray-500">Marque se a ação/projeto promove inclusão.</p>
          </div>
        </div>
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="obrigatorioSustentabilidade"
              name="obrigatorioSustentabilidade"
              type="checkbox"
              checked={obrigatorioSustentabilidade}
              onChange={(e) => setObrigatorioSustentabilidade(e.target.checked)}
              className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="obrigatorioSustentabilidade" className="font-medium text-gray-700">
              Obrigatório Sustentabilidade?
            </label>
            <p className="text-gray-500">Marque se a ação/projeto promove sustentabilidade.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="dataInicio"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Data de Início Prevista:
          </label>
          <input
            type="date"
            id="dataInicio"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label
            htmlFor="dataFinal"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Data Final Prevista:
          </label>
          <input
            type="date"
            id="dataFinal"
            value={dataFinal}
            onChange={(e) => setDataFinal(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="flex flex-col border-t border-gray-200 pt-6 mt-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
          Pessoas Envolvidas no Projeto
        </h3>
        {pessoasProjeto.map((pessoa, index) => (
          <div
            key={pessoa.id}
            className="mb-4 p-4 border border-gray-200 rounded-md relative"
          >
            <button
              type="button"
              onClick={() => handleRemovePessoaProjeto(index)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
            >
              &times;
            </button>
            <h4 className="text-md font-medium text-gray-800 mb-2">
              {pessoa.papel === PapelProjeto.Responsavel ? "Responsável" : "Colaborador"} #{pessoasProjeto.filter(p => p.papel === pessoa.papel).findIndex(p => p.id === pessoa.id) + 1}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor={`pessoaId-${index}`}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nome:
                </label>
                <select
                  id={`pessoaId-${index}`}
                  name="pessoaId"
                  value={pessoa.pessoaId}
                  onChange={(e) => handlePessoaProjetoChange(index, e)}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                >
                  <option value="">Selecione uma pessoa</option>
                  {mockPessoas.map((p) => (
                    <option key={p.pessoaId} value={p.pessoaId}>
                      {p.nome}
                    </option>
                  ))}
                </select>
              </div>
              {pessoa.papel === PapelProjeto.Colaborador && (
                <>
                  <div>
                    <label
                      htmlFor={`cargaHorariaSemanal-${index}`}
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Carga Horária Semanal (H):
                    </label>
                    <input
                      type="number"
                      id={`cargaHorariaSemanal-${index}`}
                      name="cargaHorariaSemanal"
                      value={pessoa.cargaHorariaSemanal || ""}
                      onChange={(e) => handlePessoaProjetoChange(index, e)}
                      className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`tipoVinculoHae-${index}`}
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Tipo Vínculo HAE:
                    </label>
                    <select
                      id={`tipoVinculoHae-${index}`}
                      name="tipoVinculoHAE"
                      value={pessoa.tipoVinculoHAE || ""}
                      onChange={(e) => handlePessoaProjetoChange(index, e)}
                      className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                    >
                      <option value="">Selecione o tipo</option>
                      {Object.values(TipoVinculoHAE).map((vinculo) => (
                        <option key={vinculo} value={vinculo}>
                          {vinculo === TipoVinculoHAE.NaoSeAplica ? "Não se Aplica" : `HAE ${vinculo}`}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
        <div className="flex justify-end space-x-2 mt-2">
            <button
            type="button"
            onClick={() => handleAddPessoaProjeto(PapelProjeto.Responsavel)}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
            Adicionar Responsável
            </button>
            <button
            type="button"
            onClick={() => handleAddPessoaProjeto(PapelProjeto.Colaborador)}
            className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
            Adicionar Colaborador
            </button>
        </div>
      </div>

      <div className="flex flex-col border-t border-gray-200 pt-6 mt-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
          Etapas do Projeto/Processo
        </h3>
        {etapasProcesso.map((etapa, index) => (
          <div
            key={etapa.id}
            className="mb-4 p-4 border border-gray-200 rounded-md relative"
          >
            <button
              type="button"
              onClick={() => handleRemoveEtapaProcesso(index)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
            >
              &times;
            </button>
            <h4 className="text-md font-medium text-gray-800 mb-2">
              Etapa #{index + 1}
            </h4>
            <div className="mb-2">
              <label
                htmlFor={`etapa-descricao-${index}`}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Descrição da Etapa:
              </label>
              <textarea
                id={`etapa-descricao-${index}`}
                name="descricao"
                value={etapa.descricao}
                onChange={(e) => handleEtapaProcessoChange(index, e)}
                rows={2}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
              <div>
                <label
                  htmlFor={`etapa-entregavelLinkSei-${index}`}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Entregável (Link SEI):
                </label>
                <input
                  type="url"
                  id={`etapa-entregavelLinkSei-${index}`}
                  name="entregavelLinkSei"
                  value={etapa.entregavelLinkSei || ""}
                  onChange={(e) => handleEtapaProcessoChange(index, e)}
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label
                  htmlFor={`etapa-numeroRef-${index}`}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Número de Referência:
                </label>
                <input
                  type="text"
                  id={`etapa-numeroRef-${index}`}
                  name="numeroRef"
                  value={etapa.numeroRef || ""}
                  onChange={(e) => handleEtapaProcessoChange(index, e)}
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor={`etapa-dataVerificacaoPrevista-${index}`}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Data Verificação Prevista:
                </label>
                <input
                  type="date"
                  id={`etapa-dataVerificacaoPrevista-${index}`}
                  name="dataVerificacaoPrevista"
                  value={etapa.dataVerificacaoPrevista || ""}
                  onChange={(e) => handleEtapaProcessoChange(index, e)}
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label
                  htmlFor={`etapa-dataVerificacaoRealizada-${index}`}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Data Verificação Realizada:
                </label>
                <input
                  type="date"
                  id={`etapa-dataVerificacaoRealizada-${index}`}
                  name="dataVerificacaoRealizada"
                  value={etapa.dataVerificacaoRealizada || ""}
                  onChange={(e) => handleEtapaProcessoChange(index, e)}
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label
                  htmlFor={`etapa-statusVerificacao-${index}`}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Status Verificação:
                </label>
                <select
                  id={`etapa-statusVerificacao-${index}`}
                  name="statusVerificacao"
                  value={etapa.statusVerificacao}
                  onChange={(e) => handleEtapaProcessoChange(index, e)}
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                  required
                >
                  {Object.values(StatusVerificacao).map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddEtapaProcesso}
          className="self-end mt-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Adicionar Etapa
        </button>
      </div>

      <div className="flex flex-col border-t border-gray-200 pt-6 mt-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
          Aquisições Previstas (Material de Consumo, Permanente, etc.)
        </h3>
        {aquisicoes.map((item, index) => (
          <div
            key={item.id}
            className="mb-4 p-4 border border-gray-200 rounded-md relative"
          >
            <button
              type="button"
              onClick={() => handleRemoveAquisicao(index)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
            >
              &times;
            </button>
            <h4 className="text-md font-medium text-gray-800 mb-2">
              Item de Aquisição #{index + 1}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
              <div>
                <label
                  htmlFor={`aquisicao-tipoAnexo-${index}`}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Tipo de Anexo/Item:
                </label>
                <select
                  id={`aquisicao-tipoAnexo-${index}`}
                  name="tipoAnexo"
                  value={item.tipoAnexo}
                  onChange={(e) => handleAquisicaoChange(index, e)}
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                  required
                >
                  <option value="">Selecione o tipo</option>
                  {Object.values(TipoAnexo).map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {tipo.replace(/([A-Z])/g, ' $1').trim()}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label
                  htmlFor={`aquisicao-descricaoItem-${index}`}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Descrição do Item:
                </label>
                <input
                  type="text"
                  id={`aquisicao-descricaoItem-${index}`}
                  name="descricaoItem"
                  value={item.descricaoItem}
                  onChange={(e) => handleAquisicaoChange(index, e)}
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
            </div>
            <div className="mb-2">
                <label
                    htmlFor={`aquisicao-justificativa-${index}`}
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                    Justificativa:
                </label>
                <textarea
                    id={`aquisicao-justificativa-${index}`}
                    name="justificativa"
                    value={item.justificativa || ""}
                    onChange={(e) => handleAquisicaoChange(index, e)}
                    rows={2}
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label
                  htmlFor={`aquisicao-unidadeMedida-${index}`}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Unidade Medida:
                </label>
                <input
                  type="text"
                  id={`aquisicao-unidadeMedida-${index}`}
                  name="unidadeMedida"
                  value={item.unidadeMedida || ""}
                  onChange={(e) => handleAquisicaoChange(index, e)}
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label
                  htmlFor={`aquisicao-quantidade-${index}`}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Quantidade:
                </label>
                <input
                  type="number"
                  id={`aquisicao-quantidade-${index}`}
                  name="quantidade"
                  value={item.quantidade}
                  onChange={(e) => handleAquisicaoChange(index, e)}
                  min="0"
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor={`aquisicao-valorUnitario-${index}`}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Valor Unitário (R$):
                </label>
                <input
                  type="text"
                  id={`aquisicao-valorUnitario-${index}`}
                  name="valorUnitarioEstimado"
                  value={formatCurrency(item.valorUnitarioEstimado || '0')}
                  onChange={(e) => handleAquisicaoChange(index, e)}
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
               <div>
                <label
                  htmlFor={`aquisicao-valorTotal-${index}`}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Valor Total (R$):
                </label>
                <input
                  type="text"
                  id={`aquisicao-valorTotal-${index}`}
                  name="valorTotalEstimado"
                  value={formatCurrency(item.valorTotalEstimado || '0')}
                  readOnly
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
                />
              </div>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddAquisicao}
          className="self-end mt-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Adicionar Item de Aquisição
        </button>
      </div>

      <div className="flex flex-col border-t border-gray-200 pt-6 mt-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
          Situação Problema / Oportunidade de Melhoria Associada
        </h3>
        {situacaoProblema.map((situacao, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="text"
              value={situacao}
              onChange={(e) => handleSituacaoProblemaChange(index, e)}
              placeholder={`Descrição da Situação/Oportunidade #${index + 1}`}
              className="flex-grow p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mr-2"
            />
            <button
              type="button"
              onClick={() => handleRemoveSituacaoProblema(index)}
              className="px-3 py-2 bg-red-500 text-white text-sm font-medium rounded-md shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400"
            >
              Remover
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddSituacaoProblema}
          className="self-end mt-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Adicionar Situação/Oportunidade
        </button>
      </div>

      <div className="flex justify-end pt-6 border-t border-gray-200 mt-6">
        <button
          type="submit"
          className="px-6 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Registrar Ação/Projeto
        </button>
      </div>
    </form>
  );
};

export default ProjectForm;
