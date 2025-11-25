import api from "@/lib/api";
import { CreateProcessStepDto } from "@/types/api";
import { API_ENDPOINTS } from '@/lib/config';

export const processStepService = {
  async create(data: CreateProcessStepDto) {
    const response = await api.post(API_ENDPOINTS.PROCESS_STEPS, data);
    return response.data;
  },

  async update(id: number, data: Partial<CreateProcessStepDto>) {
    try {
      const response = await api.put(`${API_ENDPOINTS.PROCESS_STEPS}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar etapa:', error);
      throw error;
    }
  },

  async delete(id: number) {
    try {
      await api.delete(`${API_ENDPOINTS.PROCESS_STEPS}/${id}`);
    } catch (error) {
      console.error('Erro ao deletar etapa:', error);
      throw error;
    }
  }
};
