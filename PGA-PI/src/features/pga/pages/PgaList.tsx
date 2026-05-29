import { useAuth } from '@/context/AuthContext';
import { AdminPgaView } from '../components/AdminPgaView';
import { RegionalPgaView } from '../components/RegionalPgaView';
import { DiretorPgaView } from '../components/DiretorPgaView';

export function PgaList() {
  const { user } = useAuth();
  if (user?.tipo_usuario === 'Regional') return <RegionalPgaView />;
  if (user?.tipo_usuario === 'Diretor') return <DiretorPgaView />;
  return <AdminPgaView />;
}