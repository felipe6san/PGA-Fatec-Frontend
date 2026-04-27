import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useForm } from "@/hooks/useForm";
import { BASE_ROUTE } from "@/lib/config";
import { anexoService } from '../services/anexoService';
import { entregaveisService } from '@/services/commonServices';
import { EntregavelLinkSei } from '@/types/api';

// Interface do formulário de anexo
interface AnexoFormData {
  item: string;
  entregavel_id: string;
  descricao: string;
  quantidade: number;
  preco_unitario_estimado: string;
  preco_total_estimado: string;
}

export const AnexoForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const anexoType = searchParams.get("type");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [entregaveis, setEntregaveis] = useState<EntregavelLinkSei[]>([]);
  
  // Validação do formulário
  const validate = (values: AnexoFormData) => {
    const errors: Partial<Record<keyof AnexoFormData, string>> = {};
    
    if (!values.item) errors.item = "Item é obrigatório";
    if (!values.entregavel_id) errors.entregavel_id = "Entregável é obrigatório";
    if (!values.descricao) errors.descricao = "Descrição é obrigatória";
    if (!values.quantidade || values.quantidade <= 0) errors.quantidade = "Quantidade deve ser maior que zero";
    if (!values.preco_unitario_estimado) errors.preco_unitario_estimado = "Preço unitário estimado é obrigatório";
    if (!values.preco_total_estimado) errors.preco_total_estimado = "Preço total estimado é obrigatório";
    
    return errors;
  };
  
  // Formulário
  const { values, errors, handleChange, handleBlur, setFieldValue } = useForm<AnexoFormData>({
    item: "",
    entregavel_id: "",
    descricao: "",
    quantidade: 1,
    preco_unitario_estimado: "",
    preco_total_estimado: ""
  }, validate);

  // Carregar entregáveis disponíveis
  useEffect(() => {
    const fetchEntregaveis = async () => {
      try {
        const data = await entregaveisService.getAll();
        setEntregaveis(data);
      } catch (error) {
        console.error("Erro ao carregar entregáveis:", error);
        setErrorMessage("Não foi possível carregar a lista de entregáveis.");
      }
    };
    
    fetchEntregaveis();
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
  const handleCurrencyChange = (fieldName: "preco_unitario_estimado" | "preco_total_estimado") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/[^\d]/g, "");
      const formattedValue = formatCurrency(value);
      setFieldValue(fieldName, formattedValue);
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
      const precoUnitValue = values.preco_unitario_estimado
        .replace(/[^\d,]/g, "")
        .replace(",", ".");
      const precoTotalValue = values.preco_total_estimado
        .replace(/[^\d,]/g, "")
        .replace(",", ".");
      
      const anexoData = {
        entregavel_id: values.entregavel_id,
        item: values.item,
        descricao: values.descricao,
        quantidade: values.quantidade,
        preco_unitario_estimado: parseFloat(precoUnitValue),
        preco_total_estimado: parseFloat(precoTotalValue),
      };
      
      await anexoService.create(anexoData);
      
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
                  htmlFor="entregavel_id" 
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Entregável:
                </label>
                <select
                  id="entregavel_id"
                  name="entregavel_id"
                  value={values.entregavel_id}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full p-3 border rounded-lg focus:ring-2 ${
                    errors.entregavel_id ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-[#ae0f0a]"
                  }`}
                >
                  <option value="">Selecione um entregável</option>
                  {entregaveis.map(entregavel => (
                    <option key={entregavel.entregavel_id} value={entregavel.entregavel_id}>
                      {`${entregavel.entregavel_numero} - ${entregavel.descricao}`}
                    </option>
                  ))}
                </select>
                {errors.entregavel_id && (
                  <p className="mt-1 text-sm text-red-600">{errors.entregavel_id}</p>
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
                htmlFor="descricao" 
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Descrição:
              </label>
              <textarea
                id="descricao"
                name="descricao"
                value={values.descricao}
                onChange={handleChange}
                onBlur={handleBlur}
                rows={3}
                className={`w-full p-3 border rounded-lg focus:ring-2 ${
                  errors.descricao ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-[#ae0f0a]"
                }`}
                placeholder="Descreva as especificações detalhadas do item"
              />
              {errors.descricao && (
                <p className="mt-1 text-sm text-red-600">{errors.descricao}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  htmlFor="preco_unitario_estimado"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Preço Unitário Estimado:
                </label>
                <input
                  type="text"
                  id="preco_unitario_estimado"
                  name="preco_unitario_estimado"
                  value={values.preco_unitario_estimado}
                  onChange={handleCurrencyChange("preco_unitario_estimado")}
                  onBlur={handleBlur}
                  className={`w-full p-3 border rounded-lg focus:ring-2 ${
                    errors.preco_unitario_estimado ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-[#ae0f0a]"
                  }`}
                  placeholder="R$ 0,00"
                />
                {errors.preco_unitario_estimado && (
                  <p className="mt-1 text-sm text-red-600">{errors.preco_unitario_estimado}</p>
                )}
              </div>

              <div>
                <label 
                  htmlFor="preco_total_estimado"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Preço Total Estimado:
                </label>
                <input
                  type="text"
                  id="preco_total_estimado"
                  name="preco_total_estimado"
                  value={values.preco_total_estimado}
                  onChange={handleCurrencyChange("preco_total_estimado")}
                  onBlur={handleBlur}
                  className={`w-full p-3 border rounded-lg focus:ring-2 ${
                    errors.preco_total_estimado ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-[#ae0f0a]"
                  }`}
                  placeholder="R$ 0,00"
                />
                {errors.preco_total_estimado && (
                  <p className="mt-1 text-sm text-red-600">{errors.preco_total_estimado}</p>
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