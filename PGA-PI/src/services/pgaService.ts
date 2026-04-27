import api from "@/lib/api";
import { API_ENDPOINTS } from '@/lib/config';
import type { PgaComUnidade, PublishPgaResult } from '@/types/api';

export interface CreatePgaPayload {
  ano: number;
  versao?: string;
  analise_cenario?: string;
  data_elaboracao?: string;
  data_limite_submissao?: string;
  is_template?: boolean;
  unidade_id?: string;
}

class PgaService {
  async getAll(): Promise<PgaComUnidade[]> {
    const response = await api.get<PgaComUnidade[]>(API_ENDPOINTS.PGA);
    return response.data;
  }

  async getTemplates(): Promise<PgaComUnidade[]> {
    const all = await this.getAll();
    return all.filter((p) => p.is_template);
  }

  async getById(id: string): Promise<PgaComUnidade> {
    const response = await api.get<PgaComUnidade>(`${API_ENDPOINTS.PGA}/${id}`);
    return response.data;
  }

  async create(payload: CreatePgaPayload): Promise<PgaComUnidade> {
    const response = await api.post<PgaComUnidade>(API_ENDPOINTS.PGA, payload);
    return response.data;
  }

  async update(id: string, payload: Partial<CreatePgaPayload>): Promise<PgaComUnidade> {
    const response = await api.put<PgaComUnidade>(`${API_ENDPOINTS.PGA}/${id}`, payload);
    return response.data;
  }

  async publish(id: string): Promise<PublishPgaResult> {
    const response = await api.post<PublishPgaResult>(`${API_ENDPOINTS.PGA}/${id}/publicar`);
    return response.data;
  }

  async submit(id: string): Promise<PgaComUnidade> {
    const response = await api.post<PgaComUnidade>(`${API_ENDPOINTS.PGA}/${id}/submeter`);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await api.delete(`${API_ENDPOINTS.PGA}/${id}`);
  }

  async exportPdf(id: string): Promise<Blob> {
    const response = await api.get(`${API_ENDPOINTS.PGA}/${id}/export/pdf`, {
      responseType: 'blob',
    });
    return response.data as Blob;
  }

  async exportCsv(id: string): Promise<Blob> {
    const response = await api.get(`${API_ENDPOINTS.PGA}/${id}/export/csv`, {
      responseType: 'blob',
    });
    return response.data as Blob;
  }
}

export const pgaService = new PgaService();
