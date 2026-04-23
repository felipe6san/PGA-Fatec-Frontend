import api from "@/lib/api";
import { API_ENDPOINTS } from '@/lib/config';

class PgaService {
  async getAll() {
    try {
      const response = await api.get(API_ENDPOINTS.PGA);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar PGAs:', error);
      throw error;
    }
  }

  async getById(id: number) {
    try {
      const response = await api.get(`${API_ENDPOINTS.PGA}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar PGA por id:', error);
      throw error;
    }
  }
}

export const pgaService = new PgaService();