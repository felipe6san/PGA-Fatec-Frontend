import { useEffect } from 'react';
import { auditService } from '@/services/auditService';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';

export const useAutoSnapshot = (pgaId: number | null, ano: number) => {
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const createSnapshot = async () => {
      if (!pgaId || !user?.pessoa_id || !ano) return;

      try {
        console.log(`Criando snapshot automático para PGA ${pgaId}`);
        
        await auditService.createSnapshotForPGA(pgaId, ano, user.pessoa_id);
        
        toast({
          title: "Snapshot Criado",
          description: `Configurações de ${ano} foram preservadas para este PGA`,
        });
      } catch (error) {
        console.error('Erro ao criar snapshot automático:', error);
        // Silencioso - não queremos interromper o fluxo do usuário
      }
    };

    // Criar snapshot quando um PGA é criado ou modificado
    createSnapshot();
  }, [pgaId, ano, user?.pessoa_id]);
};