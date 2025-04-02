import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "../../dashboard/components/cardDashboard";

export const Settings = (): JSX.Element => {
  const [settings, setSettings] = useState({
    notifications: true,
    emailUpdates: false,
    theme: "light",
    language: "pt-BR",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  return (
    <>
      <h1 className="font-extrabold text-black text-[32px] text-center mb-[30px]">
        Configurações
      </h1>

      <Card className="w-full shadow-[0px_0px_25px_#00000026] rounded-xl">
        <CardHeader className="bg-neutral-100 rounded-t-xl py-[15px] px-6">
          <h2 className="font-normal text-black text-[28px]">
            Preferências do Sistema
          </h2>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Notificações</h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="notifications"
                    checked={settings.notifications}
                    onChange={handleChange}
                    className="rounded border-gray-300"
                  />
                  <span>Ativar notificações do sistema</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="emailUpdates"
                    checked={settings.emailUpdates}
                    onChange={handleChange}
                    className="rounded border-gray-300"
                  />
                  <span>Receber atualizações por e-mail</span>
                </label>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Aparência</h3>
              <div>
                <label
                  htmlFor="theme"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Tema
                </label>
                <select
                  id="theme"
                  name="theme"
                  value={settings.theme}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="light">Claro</option>
                  <option value="dark">Escuro</option>
                </select>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Idioma</h3>
              <div>
                <label
                  htmlFor="language"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Selecionar idioma
                </label>
                <select
                  id="language"
                  name="language"
                  value={settings.language}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="pt-BR">Português (Brasil)</option>
                  <option value="en">English</option>
                  <option value="es">Español</option>
                </select>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="button"
                className="px-4 py-2 bg-[#ae0f0a] text-white rounded-md hover:bg-[#910c08]"
              >
                Salvar Alterações
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};