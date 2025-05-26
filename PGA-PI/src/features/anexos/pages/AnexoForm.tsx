import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useForm } from "@/hooks/useForm";
import { BASE_ROUTE } from "@/lib/config";
import api from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

// Enum que representa os tipos de anexo
enum AnexoProjetoUm {
  Anexo1 = "1",
  Anexo2 = "2",
  Anexo3 = "3",
  Anexo4 = "4"
}

// Interface do formulário de anexo
interface AnexoFormData {
  item: string;
  projeto: string;
  denominacaoOuEspecificacao: string;
  quantidade: number;
  precoTotalEstimado: string;
}

export const AnexoForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const anexoType = searchParams.get("type");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [projetos, setProjetos] = useState<Array<{id: string, tema: string}>>([]);
  const { user } = useAuth();
  
  // Validação do formulário
  const validate = (values: AnexoFormData) => {
    const errors: Partial<Record<keyof AnexoFormData, string>> = {};
    
    if (!values.item) errors.item = "Item é obrigatório";
    if (!values.projeto) errors.projeto = "Projeto é obrigatório";
    if (!values.denominacaoOuEspecificacao) errors.denominacaoOuEspecificacao = "Denominação/especificação é obrigatória";
    if (!values.quantidade || values.quantidade <= 0) errors.quantidade = "Quantidade deve ser maior que zero";
    if (!values.precoTotalEstimado) errors.precoTotalEstimado = "Preço total estimado é obrigatório";
    
    return errors;
  };
  
  // Formulário
  const { values, errors, handleChange, handleBlur, setFieldValue } = useForm<AnexoFormData>({
    item: "",
    projeto: "",
    denominacaoOuEspecificacao: "",
    quantidade: 1,
    precoTotalEstimado: ""
  }, validate);

  // Carregar projetos disponíveis
  useEffect(() => {
    const fetchProjetos = async () => {
      try {
        // Em produção, substituir por chamada à API real
        // const response = await api.get('/projetos');
        // setProjetos(response.data);
        
        // Mock para desenvolvimento
        setProjetos([
          { id: "1", tema: "Modernização dos Laboratórios de Informática" },
          { id: "2", tema: "Implementação de Programa de Mentoria Estudantil" },
          { id: "3", tema: "Melhoria da Infraestrutura de Redes" },
        ]);
      } catch (error) {
        console.error("Erro ao carregar projetos:", error);
        setErrorMessage("Não foi possível carregar a lista de projetos.");
      }
    };
    
    fetchProjetos();
  }, []);

  // Formatar o valor para exibição em formato monetário
  const formatCurrency = (value: string) => {
    const cleanValue = value.replace(/\D/g, "");
    const numericValue = parseInt(cleanValue, 10) / 100;
    
    if (isNaN(numericValue)) return "";
    
    return numericValue.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  // Processar input de valor monetário
  const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, "");
    const formattedValue = formatCurrency(value);
    setFieldValue("precoTotalEstimado", formattedValue);
  };

  // Título com base no anexo selecionado
  const getAnexoTitle = () => {
    switch (anexoType) {
      case "1": return "Anexo 1";
      case "2": return "Anexo 2";
      case "3": return "Anexo 3";
      case "4": return "Anexo 4";
      default: return "Anexo";
    }
  };

  // Enviar o formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar formulário
    const validationErrors = validate(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrorMessage("Por favor, corrija os erros no formulário.");
      return;
    }
    
    setIsSubmitting(true);
    setErrorMessage(null);
    
    try {
      // Preparar dados para envio
      const precoValue = values.precoTotalEstimado
        .replace(/[^\d,]/g, "")
        .replace(",", ".");
      
      const anexoData = {
        ...values,
        precoTotalEstimado: parseFloat(precoValue),
        flag: anexoType // Envia o tipo de anexo automaticamente
      };
      
      // Em produção, substituir por chamada à API real
      // await api.post('/anexos', anexoData);
      console.log("Dados do anexo sendo enviados:", anexoData);
      
      // Redirecionar após salvamento bem-sucedido
      navigate(`${BASE_ROUTE}projects/list`);
    } catch (error) {
      console.error("Erro ao salvar anexo:", error);
      setErrorMessage("Erro ao salvar o anexo. Por favor, tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-4">
        <button
          onClick={() => navigate(`${BASE_ROUTE}projects`)}
          className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
        >
          ← Voltar para seleção
        </button>
      </div>
    
      <h1 className="font-extrabold text-black text-[32px] text-center mb-6">
        Formulário - {getAnexoTitle()}
      </h1>
      
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
          {errorMessage}
        </div>
      )}

      <Card className="w-full shadow-[0px_0px_25px_#00000026] rounded-xl">
        <CardHeader className="bg-neutral-100 rounded-t-xl py-[15px] px-6">
          <h2 className="font-normal text-black text-[24px]">
            Preencha os dados do {getAnexoTitle()}
          </h2>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label 
                  htmlFor="projeto" 
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Projeto Vinculado:
                </label>
                <select
                  id="projeto"
                  name="projeto"
                  value={values.projeto}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full p-3 border rounded-lg focus:ring-2 ${
                    errors.projeto ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-[#ae0f0a]"
                  }`}
                >
                  <option value="">Selecione um projeto</option>
                  {projetos.map(projeto => (
                    <option key={projeto.id} value={projeto.id}>
                      {projeto.tema}
                    </option>
                  ))}
                </select>
                {errors.projeto && (
                  <p className="mt-1 text-sm text-red-600">{errors.projeto}</p>
                )}
              </div>

              <div>
                <label 
                  htmlFor="item" 
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Item:
                </label>
                <input
                  type="text"
                  id="item"
                  name="item"
                  value={values.item}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full p-3 border rounded-lg focus:ring-2 ${
                    errors.item ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-[#ae0f0a]"
                  }`}
                  placeholder="Digite o nome do item"
                />
                {errors.item && (
                  <p className="mt-1 text-sm text-red-600">{errors.item}</p>
                )}
              </div>
            </div>

            <div>
              <label 
                htmlFor="denominacaoOuEspecificacao" 
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Denominação/Especificação:
              </label>
              <textarea
                id="denominacaoOuEspecificacao"
                name="denominacaoOuEspecificacao"
                value={values.denominacaoOuEspecificacao}
                onChange={handleChange}
                onBlur={handleBlur}
                rows={3}
                className={`w-full p-3 border rounded-lg focus:ring-2 ${
                  errors.denominacaoOuEspecificacao ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-[#ae0f0a]"
                }`}
                placeholder="Descreva as especificações detalhadas do item"
              />
              {errors.denominacaoOuEspecificacao && (
                <p className="mt-1 text-sm text-red-600">{errors.denominacaoOuEspecificacao}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label 
                  htmlFor="quantidade" 
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Quantidade:
                </label>
                <input
                  type="number"
                  id="quantidade"
                  name="quantidade"
                  value={values.quantidade}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  min="1"
                  className={`w-full p-3 border rounded-lg focus:ring-2 ${
                    errors.quantidade ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-[#ae0f0a]"
                  }`}
                />
                {errors.quantidade && (
                  <p className="mt-1 text-sm text-red-600">{errors.quantidade}</p>
                )}
              </div>

              <div>
                <label 
                  htmlFor="precoTotalEstimado" 
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Preço Total Estimado:
                </label>
                <input
                  type="text"
                  id="precoTotalEstimado"
                  name="precoTotalEstimado"
                  value={values.precoTotalEstimado}
                  onChange={handleCurrencyChange}
                  onBlur={handleBlur}
                  className={`w-full p-3 border rounded-lg focus:ring-2 ${
                    errors.precoTotalEstimado ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-[#ae0f0a]"
                  }`}
                  placeholder="R$ 0,00"
                />
                {errors.precoTotalEstimado && (
                  <p className="mt-1 text-sm text-red-600">{errors.precoTotalEstimado}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button
                type="button"
                onClick={() => navigate(`${BASE_ROUTE}projects`)}
                className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-[#ae0f0a] text-white rounded-lg hover:bg-[#8e0c08] transition-colors"
              >
                {isSubmitting ? "Salvando..." : "Salvar Anexo"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};