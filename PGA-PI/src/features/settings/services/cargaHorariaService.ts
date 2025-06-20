import api from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/config';
import { TipoVinculoHAE } from '@/types/api';

export interface CreateCargaHorariaDto {
  sigla: string;
  descricao: string;
  detalhes?: string;
}

export interface UpdateCargaHorariaDto {
  sigla?: string;
  descricao?: string;
  detalhes?: string;
}

class CargaHorariaService {
  async getAll(): Promise<TipoVinculoHAE[]> {
    try {
      const response = await api.get<TipoVinculoHAE[]>(API_ENDPOINTS.WORKLOAD_HAE);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar tipos de carga horária:', error);
      throw new Error('Falha ao carregar tipos de carga horária');
    }
  }

  async getById(id: number): Promise<TipoVinculoHAE> {
    try {
      const response = await api.get<TipoVinculoHAE>(`${API_ENDPOINTS.WORKLOAD_HAE}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar tipo de carga horária:', error);
      throw new Error('Falha ao carregar tipo de carga horária');
    }
  }

  async create(data: CreateCargaHorariaDto): Promise<TipoVinculoHAE> {
    try {
      const response = await api.post<TipoVinculoHAE>(API_ENDPOINTS.WORKLOAD_HAE, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar tipo de carga horária:', error);
      throw new Error('Falha ao criar tipo de carga horária');
    }
  }

  async update(id: number, data: UpdateCargaHorariaDto): Promise<TipoVinculoHAE> {
    try {
      const response = await api.put<TipoVinculoHAE>(`${API_ENDPOINTS.WORKLOAD_HAE}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar tipo de carga horária:', error);
      throw new Error('Falha ao atualizar tipo de carga horária');
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await api.delete(`${API_ENDPOINTS.WORKLOAD_HAE}/${id}`);
    } catch (error) {
      console.error('Erro ao deletar tipo de carga horária:', error);
      throw new Error('Falha ao deletar tipo de carga horária');
    }
  }
}

export const cargaHorariaService = new CargaHorariaService();