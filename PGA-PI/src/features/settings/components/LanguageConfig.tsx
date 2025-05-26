import { ConfigSection } from "./ConfigSection";

interface LanguageConfigProps {
  language: string;
  onChange: (name: string, value: string) => void;
}

export const LanguageConfig = ({ language, onChange }: LanguageConfigProps) => {
  return (
    <ConfigSection title="Idioma">
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
          value={language}
          onChange={(e) => onChange("language", e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
        >
          <option value="pt-BR">Português (Brasil)</option>
          <option value="en">English</option>
          <option value="es">Español</option>
        </select>
      </div>
    </ConfigSection>
  );
};