import { useState } from "react";
import { Card, CardContent, CardHeader } from "../../../components/ui/card";
import { NotificationsConfig } from "./NotificationsConfig";
import { AppearanceConfig } from "./AppearanceConfig";
import { LanguageConfig } from "./LanguageConfig";
import { Button } from "@/components/ui/button";
import { toast } from "@components/ui/use-toast";

export const SystemPreferences = () => {
  const [settings, setSettings] = useState({
    notifications: true,
    emailUpdates: false,
    theme: "light",
    language: "pt-BR",
  });

  const handleChange = (name: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    // Simulação de salvamento das configurações
    console.log("Configurações salvas:", settings);
    
    toast({
      title: "Configurações salvas",
      description: "Suas preferências foram salvas com sucesso.",
    });
  };

  return (
    <Card className="w-full shadow-[0px_0px_25px_#00000026] rounded-xl mb-6">
      <CardHeader className="bg-neutral-100 rounded-t-xl py-[15px] px-6">
        <h2 className="font-normal text-black text-[28px]">
          Preferências do Sistema
        </h2>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          <NotificationsConfig
            notifications={settings.notifications}
            emailUpdates={settings.emailUpdates}
            onChange={handleChange}
          />

          <AppearanceConfig 
            theme={settings.theme} 
            onChange={handleChange} 
          />

          <LanguageConfig 
            language={settings.language} 
            onChange={handleChange} 
          />

          <div className="pt-4">
            <Button 
              onClick={handleSave}
              className="px-4 py-2 bg-[#ae0f0a] text-white hover:bg-[#910c08]"
            >
              Salvar Alterações
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};