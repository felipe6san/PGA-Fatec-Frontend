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
    <form onSubmit={handleSubmit} className="space-y-6 p-4 max-w-4xl mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Registro de Projeto</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="projectId" className="block text-sm font-medium text-gray-700 mb-1">ID do Projeto (Tema):</label>
          <input
            type="text"
            id="projectId"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">Nome do Projeto (Opcional):</label>
          <input
            type="text"
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="ano" className="block text-sm font-medium text-gray-700 mb-1">Ano:</label>
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
          <label htmlFor="origem" className="block text-sm font-medium text-gray-700 mb-1">Origem:</label>
          <select
            id="origem"
            value={origem}
            onChange={(e) => setOrigem(e.target.value)}
            required
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
            //TODO {/* Add other relevant origins based on your system */}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-1">O que será feito:</label>
        <textarea
          id="descricao"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          rows={3}
          required
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="justificativa" className="block text-sm font-medium text-gray-700 mb-1">Por que será feito:</label>
        <textarea
          id="justificativa"
          value={justificativa}
          onChange={(e) => setJustificativa(e.target.value)}
          rows={3}
          required
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="dataInicial" className="block text-sm font-medium text-gray-700 mb-1">Data Inicial:</label>
            <input
              type="date"
              id="dataInicial"
              value={dataInicial}
              onChange={(e) => setDataInicial(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="dataFinal" className="block text-sm font-medium text-gray-700 mb-1">Data Final:</label>
            <input
              type="date"
              id="dataFinal"
              value={dataFinal}
              onChange={(e) => setDataFinal(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
              <label htmlFor="custo" className="block text-sm font-medium text-gray-700 mb-1">Custo Estimado (R$):</label>
              <input
                type="number"
                id="custo"
                value={custo}
                onChange={(e) => setCusto(e.target.value)}
                step="0.01"
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
          </div>
          <div>
              <label htmlFor="fonteRecursos" className="block text-sm font-medium text-gray-700 mb-1">Fonte de Recursos:</label>
              <input
                type="text"
                id="fonteRecursos"
                value={fonteRecursos}
                onChange={(e) => setFonteRecursos(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
          </div>
      </div>

      <div>
        <label htmlFor="responsavel" className="block text-sm font-medium text-gray-700 mb-1">Responsável (ID do Usuário):</label>
        <input
          type="number" // Consider changing to a user selector component later
          id="responsavel"
          value={responsavel}
          onChange={(e) => setResponsavel(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {/* Colaboradores Section */}
      <div className="border-t border-gray-200 pt-6 mt-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Colaboradores</h3>
          {colaboradores.map((colaborador, index) => (
            <div key={colaborador.id} className="mb-4 p-4 border border-gray-200 rounded-md relative">
               <button
                  type="button"
                  onClick={() => handleRemoveColaborador(index)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                >
                  &times; {/* Simple 'x' icon */}
                </button>
              <h4 className="text-md font-medium text-gray-800 mb-2">Colaborador #{index + 1}</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor={`userId-${index}`} className="block text-sm font-medium text-gray-700 mb-1">ID do Usuário:</label>
                    <input
                      type="number" // Consider changing to a user selector
                      id={`userId-${index}`}
                      name="userId"
                      value={colaborador.userId}
                      onChange={(e) => handleColaboradorChange(index, e)}
                      className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label htmlFor={`cargaHorariaSemanal-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                      Carga Horária Semanal:
                    </label>
                    <input
                      type="number"
                      id={`cargaHorariaSemanal-${index}`}
                      name="cargaHorariaSemanal"
                      value={colaborador.cargaHorariaSemanal}
                      onChange={(e) => handleColaboradorChange(index, e)}
                      className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label htmlFor={`tipoCargaHoraria-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de Carga Horária:
                    </label>
                    <input // Consider changing to a select if predefined types exist
                      type="text"
                      id={`tipoCargaHoraria-${index}`}
                      name="tipoCargaHoraria"
                      value={colaborador.tipoCargaHoraria}
                      onChange={(e) => handleColaboradorChange(index, e)}
                      className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddColaborador}
            className="mt-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Adicionar Colaborador
          </button>
      </div>

      {/* Etapas Section */}
       <div className="border-t border-gray-200 pt-6 mt-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Etapas do Projeto</h3>
          {etapas.map((etapa, index) => (
            <div key={etapa.id} className="mb-4 p-4 border border-gray-200 rounded-md relative">
               <button
                  type="button"
                  onClick={() => handleRemoveEtapa(index)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                >
                  &times;
                </button>
              <h4 className="text-md font-medium text-gray-800 mb-2">Etapa #{index + 1}</h4>
              <div className="mb-2">
                  <label htmlFor={`etapa-descricao-${index}`} className="block text-sm font-medium text-gray-700 mb-1">Descrição:</label>
                  <input
                      type="text"
                      id={`etapa-descricao-${index}`}
                      name="descricao"
                      value={etapa.descricao}
                      onChange={(e) => handleEtapaChange(index, e)}
                      className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      required
                  />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor={`etapa-dataInicio-${index}`} className="block text-sm font-medium text-gray-700 mb-1">Data de Início:</label>
                    <input
                      type="date"
                      id={`etapa-dataInicio-${index}`}
                      name="dataInicio"
                      value={etapa.dataInicio}
                      onChange={(e) => handleEtapaChange(index, e)}
                      className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor={`etapa-dataFim-${index}`} className="block text-sm font-medium text-gray-700 mb-1">Data de Fim:</label>
                    <input
                      type="date"
                      id={`etapa-dataFim-${index}`}
                      name="dataFim"
                      value={etapa.dataFim}
                      onChange={(e) => handleEtapaChange(index, e)}
                      className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddEtapa}
            className="mt-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Adicionar Etapa
          </button>
      </div>

      {/* Situação Problema Section */}
      <div className="border-t border-gray-200 pt-6 mt-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Situação Problema / Oportunidade de Melhoria</h3>
        {situacaoProblema.map((situacao, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="text"
              value={situacao}
              onChange={(e) => handleSituacaoProblemaChange(index, e)}
              placeholder={`Descrição #${index + 1}`}
              className="flex-grow p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mr-2"
              required
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
          className="mt-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Adicionar Situação/Oportunidade
        </button>
      </div>

      <div className="flex justify-end pt-6 border-t border-gray-200 mt-6">
        <button
          type="submit"
          className="px-6 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Registrar Projeto
        </button>
      </div>
    </form>
  );
};

export default ProjectForm;
