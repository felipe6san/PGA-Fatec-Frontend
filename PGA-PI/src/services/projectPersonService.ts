import api from "@/lib/api";
import { CreateProjetoPessoaDto } from "@/types/api";
import { API_ENDPOINTS } from '@/lib/config';

export const projetoPessoaService = {
  async create(data: CreateProjetoPessoaDto) {
    const response = await api.post(API_ENDPOINTS.PROJECT_PERSON, data);
    return response.data;
  },
  // Adicione outros métodos se necessário
};