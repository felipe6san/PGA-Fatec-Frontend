import React, { useState } from "react";

interface Colaborador {
  id: number;
  userId: string;
  cargaHorariaSemanal: string;
  tipoCargaHoraria: string;
}

interface Etapa {
  id: number;
  descricao: string;
  dataInicio: string;
  dataFim: string;
}

const ProjectForm: React.FC = () => {
  const [projectId, setProjectId] = useState<string>("");
  const [nome, setNome] = useState<string>("");
  const [ano, setAno] = useState<number>(new Date().getFullYear());
  const [origem, setOrigem] = useState<string>("");
  const [descricao, setDescricao] = useState<string>("");
  const [justificativa, setJustificativa] = useState<string>("");
  const [dataInicial, setDataInicial] = useState<string>("");
  const [dataFinal, setDataFinal] = useState<string>("");
  const [custo, setCusto] = useState<string>("");
  const [fonteRecursos, setFonteRecursos] = useState<string>("");
  const [responsavel, setResponsavel] = useState<string>(""); //TODO use User IDs later
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([
    { id: 0, userId: "", cargaHorariaSemanal: "", tipoCargaHoraria: "" },
  ]); //TODO use User IDs later
  const [etapas, setEtapas] = useState<Etapa[]>([
    { id: 0, descricao: "", dataInicio: "", dataFim: "" },
  ]);
  const [situacaoProblema, setSituacaoProblema] = useState<string[]>([""]);

  const handleAddColaborador = () => {
    setColaboradores([
      ...colaboradores,
      {
        id: colaboradores.length,
        userId: "",
        cargaHorariaSemanal: "",
        tipoCargaHoraria: "",
      },
    ]);
  };

  const handleColaboradorChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    const newColaboradores = [...colaboradores];
    newColaboradores[index] = { ...newColaboradores[index], [name]: value };
    setColaboradores(newColaboradores);
  };

  const handleRemoveColaborador = (index: number) => {
    const newColaboradores = colaboradores.filter((_, i) => i !== index);
    setColaboradores(newColaboradores);
  };

  const handleAddEtapa = () => {
    setEtapas([
      ...etapas,
      { id: etapas.length, descricao: "", dataInicio: "", dataFim: "" },
    ]);
  };

  const handleEtapaChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    const newEtapas = [...etapas];
    newEtapas[index] = { ...newEtapas[index], [name]: value };
    setEtapas(newEtapas);
  };

  const handleRemoveEtapa = (index: number) => {
    const newEtapas = etapas.filter((_, i) => i !== index);
    setEtapas(newEtapas);
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

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const formData = {
      projectId,
      nome,
      ano,
      origem,
      descricao,
      justificativa,
      dataInicial,
      dataFinal,
      custo,
      fonteRecursos,
      responsavel,
      colaboradores,
      etapas,
      situacaoProblema,
    };
    console.log("Form Data:", formData);
    //TODO Here you would typically send the form data to your backend
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Registro de Projeto</h2>

      <div>
        <label htmlFor="projectId">ID do Projeto (Tema):</label>
        <input
          type="text"
          id="projectId"
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="nome">Nome do Projeto (Opcional):</label>
        <input
          type="text"
          id="nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="ano">Ano:</label>
        <input
          type="number"
          id="ano"
          value={ano}
          onChange={(e) => setAno(parseInt(e.target.value))}
          required
        />
      </div>

      <div>
        <label htmlFor="origem">Origem:</label>
        <select
          id="origem"
          value={origem}
          onChange={(e) => setOrigem(e.target.value)}
          required
        >
          <option value="">Selecione a Origem</option>
          <option value="CPA">
            CPA (Relatório da Comissão Própria de Avaliação da Unidade)
          </option>
          <option value="Outra">Outra</option>
          <option value="CEE">
            CEE (Relatório Circunstanciado do Conselho Estadual de Educação)
          </option>
          //TODO {/* Add other relevant origins based on your system */}
        </select>
      </div>

      <div>
        <label htmlFor="descricao">O que será feito:</label>
        <textarea
          id="descricao"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          rows={3}
          required
        />
      </div>

      <div>
        <label htmlFor="justificativa">Por que será feito:</label>
        <textarea
          id="justificativa"
          value={justificativa}
          onChange={(e) => setJustificativa(e.target.value)}
          rows={3}
          required
        />
      </div>

      <div>
        <label htmlFor="responsavel">Responsável (ID do Usuário):</label>
        <input
          type="number"
          id="responsavel"
          value={responsavel}
          onChange={(e) => setResponsavel(e.target.value)}
          required
        />
      </div>

      <h3>Colaboradores</h3>
      {colaboradores.map((colaborador, index) => (
        <div key={colaborador.id}>
          <h4>Colaborador #{index + 1}</h4>
          <div>
            <label htmlFor={`userId-${index}`}>ID do Usuário:</label>
            <input
              type="number"
              id={`userId-${index}`}
              name="userId"
              value={colaborador.userId}
              onChange={(e) => handleColaboradorChange(index, e)}
            />
          </div>
          <div>
            <label htmlFor={`cargaHorariaSemanal-${index}`}>
              Carga Horária Semanal:
            </label>
            <input
              type="number"
              id={`cargaHorariaSemanal-${index}`}
              name="cargaHorariaSemanal"
              value={colaborador.cargaHorariaSemanal}
              onChange={(e) => handleColaboradorChange(index, e)}
            />
          </div>
          <div>
            <label htmlFor={`tipoCargaHoraria-${index}`}>
              Tipo de Carga Horária:
            </label>
            <input
              type="text"
              id={`tipoCargaHoraria-${index}`}
              name="tipoCargaHoraria"
              value={colaborador.tipoCargaHoraria}
              onChange={(e) => handleColaboradorChange(index, e)}
            />
          </div>
          {colaboradores.length > 1 && (
            <button
              type="button"
              onClick={() => handleRemoveColaborador(index)}
            >
              Remover Colaborador
            </button>
          )}
        </div>
      ))}
      <button type="button" onClick={handleAddColaborador}>
        Adicionar Colaborador
      </button>

      <div>
        <label htmlFor="dataInicial">Data Inicial:</label>
        <input
          type="date"
          id="dataInicial"
          value={dataInicial}
          onChange={(e) => setDataInicial(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="dataFinal">Data Final:</label>
        <input
          type="date"
          id="dataFinal"
          value={dataFinal}
          onChange={(e) => setDataFinal(e.target.value)}
          required
        />
      </div>

      <h3>Etapas do Processo</h3>
      {etapas.map((etapa, index) => (
        <div key={etapa.id}>
          <h4>Etapa #{index + 1}</h4>
          <div>
            <label htmlFor={`descricaoEtapa-${index}`}>Descrição:</label>
            <input
              type="text"
              id={`descricaoEtapa-${index}`}
              name="descricao"
              value={etapa.descricao}
              onChange={(e) => handleEtapaChange(index, e)}
            />
          </div>
          <div>
            <label htmlFor={`dataInicioEtapa-${index}`}>Data de Início:</label>
            <input
              type="date"
              id={`dataInicioEtapa-${index}`}
              name="dataInicio"
              value={etapa.dataInicio}
              onChange={(e) => handleEtapaChange(index, e)}
            />
          </div>
          <div>
            <label htmlFor={`dataFimEtapa-${index}`}>Data de Fim:</label>
            <input
              type="date"
              id={`dataFimEtapa-${index}`}
              name="dataFim"
              value={etapa.dataFim}
              onChange={(e) => handleEtapaChange(index, e)}
            />
          </div>
          {etapas.length > 1 && (
            <button type="button" onClick={() => handleRemoveEtapa(index)}>
              Remover Etapa
            </button>
          )}
        </div>
      ))}
      <button type="button" onClick={handleAddEtapa}>
        Adicionar Etapa
      </button>

      <div>
        <label htmlFor="custo">Custo (R$):</label>
        <input
          type="number"
          id="custo"
          value={custo}
          onChange={(e) => setCusto(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="fonteRecursos">Fonte(s) dos Recursos:</label>
        <input
          type="text"
          id="fonteRecursos"
          value={fonteRecursos}
          onChange={(e) => setFonteRecursos(e.target.value)}
        />
      </div>

      <h3>Situação Problema (a ser resolvida/mitigada)</h3>
      {situacaoProblema.map((problema, index) => (
        <div key={index}>
          <label htmlFor={`situacaoProblema-${index}`}>Problema:</label>
          <input
            type="text"
            id={`situacaoProblema-${index}`}
            value={problema}
            onChange={(e) => handleSituacaoProblemaChange(index, e)}
          />
          {situacaoProblema.length > 1 && (
            <button
              type="button"
              onClick={() => handleRemoveSituacaoProblema(index)}
            >
              Remover Problema
            </button>
          )}
        </div>
      ))}
      <button type="button" onClick={handleAddSituacaoProblema}>
        Adicionar Problema
      </button>

      <button type="submit">Registrar Projeto</button>
    </form>
  );
};

export default ProjectForm;
