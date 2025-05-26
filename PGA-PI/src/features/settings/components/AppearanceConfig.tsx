import { ConfigSection } from "./ConfigSection";

interface AppearanceConfigProps {
  theme: string;
  onChange: (name: string, value: string) => void;
}

export const AppearanceConfig = ({ theme, onChange }: AppearanceConfigProps) => {
  return (
    <ConfigSection title="Aparência">
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
          value={theme}
          onChange={(e) => onChange("theme", e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
        >
          <option value="light">Claro</option>
          <option value="dark">Escuro</option>
        </select>
      </div>
    </ConfigSection>
  );
};