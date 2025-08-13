import api from "@/lib/api";
import { CreateProcessStepDto } from "@/types/api";
import { API_ENDPOINTS } from '@/lib/config';

export const processStepService = {
  async create(data: CreateProcessStepDto) {
    const response = await api.post(API_ENDPOINTS.PROCESS_STEPS, data);
    return response.data;
  },
};