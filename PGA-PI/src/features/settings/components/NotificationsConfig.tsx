import { ConfigSection } from "./ConfigSection";

interface NotificationsConfigProps {
  notifications: boolean;
  emailUpdates: boolean;
  onChange: (name: string, value: boolean) => void;
}

export const NotificationsConfig = ({ 
  notifications, 
  emailUpdates, 
  onChange 
}: NotificationsConfigProps) => {
  return (
    <ConfigSection title="Notificações">
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          name="notifications"
          checked={notifications}
          onChange={(e) => onChange("notifications", e.target.checked)}
          className="rounded border-gray-300"
        />
        <span>Ativar notificações do sistema</span>
      </label>
      
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          name="emailUpdates"
          checked={emailUpdates}
          onChange={(e) => onChange("emailUpdates", e.target.checked)}
          className="rounded border-gray-300"
        />
        <span>Receber atualizações por e-mail</span>
      </label>
    </ConfigSection>
  );
};