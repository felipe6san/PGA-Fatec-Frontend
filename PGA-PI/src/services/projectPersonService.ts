import api from "@/lib/api";
import { CreateProjetoPessoaDto } from "@/types/api";
import { API_ENDPOINTS } from '@/lib/config';

export const projetoPessoaService = {
  async create(data: CreateProjetoPessoaDto) {
    const response = await api.post(API_ENDPOINTS.PROJECT_PERSON, data);
    return response.data;
  },

  async update(id: number, data: Partial<CreateProjetoPessoaDto>) {
    try {
      const response = await api.put(`${API_ENDPOINTS.PROJECT_PERSON}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar pessoa do projeto:', error);
      throw error;
    }
  },

  async delete(id: number) {
    try {
      await api.delete(`${API_ENDPOINTS.PROJECT_PERSON}/${id}`);
    } catch (error) {
      console.error('Erro ao remover pessoa do projeto:', error);
      throw error;
    }
  }
};
