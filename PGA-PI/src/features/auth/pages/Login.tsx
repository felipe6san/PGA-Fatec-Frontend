import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { logoImage, bgImage } from "@/assets";
import { AlertCircle, Info, XCircle, CheckCircle } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import api from "@/lib/api";
import { BASE_ROUTE } from "@/lib";
import { Select, SelectContent, SelectItem, SelectGroup, SelectTrigger, SelectValue } from "@/components/ui/select";

type ErrorType = "credentials" | "server" | "connection" | "validation" | null;

export const Login = (): JSX.Element => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [credentials, setCredentials] = useState({
    email: "",
    senha: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [errorType, setErrorType] = useState<ErrorType>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingReset, setIsLoadingReset] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [id]: value,
    }));

    if (errorType) {
      setErrorType(null);
      setErrorMessage("");
    }
  };

  const validateForm = (): boolean => {
    if (!credentials.email) {
      setErrorType("validation");
      setErrorMessage("Por favor, informe seu email.");
      return false;
    }

    if (!credentials.email.includes("@")) {
      setErrorType("validation");
      setErrorMessage("Por favor, informe um email válido.");
      return false;
    }

    if (!credentials.senha) {
      setErrorType("validation");
      setErrorMessage("Por favor, informe sua senha.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setErrorType(null);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      console.log('Tentando fazer login...'); // Debug
      const success = await login(credentials.email, credentials.senha);
      console.log('Login success:', success); // Debug

      if (success) {
        console.log('Redirecionando para dashboard...'); // Debug
        // Usar window.location para garantir o redirecionamento
        window.location.href = `${BASE_ROUTE}dashboard`;
      } else {
        setErrorType("credentials");
        setErrorMessage(
          "Email ou senha incorretos. Verifique suas credenciais e tente novamente."
        );
      }
    } catch (err: any) {
      console.error('Erro no login:', err); // Debug
      if (err.response) {
        if (err.response.status === 401 || err.response.status === 403) {
          setErrorType("credentials");
          setErrorMessage(
            "Email ou senha incorretos. Verifique suas credenciais e tente novamente."
          );
        } else if (err.response.status >= 500) {
          setErrorType("server");
          setErrorMessage(
            "Erro no servidor. Por favor, tente novamente mais tarde."
          );
        } else {
          setErrorType("server");
          setErrorMessage(
            err.response.data?.message ||
              "Ocorreu um erro durante o login. Tente novamente."
          );
        }
      } else if (err.request) {
        setErrorType("connection");
        setErrorMessage(
          "Não foi possível conectar ao servidor. Verifique sua conexão de internet."
        );
      } else {
        setErrorType("server");
        setErrorMessage(
          "Ocorreu um erro ao tentar fazer login. Por favor, tente novamente."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetStatus, setResetStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleResetPassword = async () => {
    if (!resetEmail || !resetEmail.includes("@")) {
      setResetStatus({
        type: "error",
        message: "Por favor, insira um email válido.",
      });
      return;
    }

    setIsLoadingReset(true);
    try {
      await api.post("/users/reset-password", { email: resetEmail });
      setResetStatus({
        type: "success",
        message:
          "Email de recuperação enviado. Por favor, verifique sua caixa de entrada.",
      });
      setTimeout(() => {
        setIsModalOpen(false);
        setResetStatus({ type: null, message: "" });
      }, 3000);
    } catch (error) {
      setResetStatus({
        type: "error",
        message: "Erro ao enviar email de recuperação. Tente novamente.",
      });
    } finally {
      setIsLoadingReset(false);
    }
  };

  const handleForgotPassword = () => {
    setIsModalOpen(true);
  };

  // Estados para o modal de solicitação de acesso
  const [isRequestAccessModalOpen, setIsRequestAccessModalOpen] = useState(false);
  const [accessRequestData, setAccessRequestData] = useState({
    nome: '',
    email: '',
    codigo_unidade: '', // Mudou de unidade_id para codigo_unidade
  });
  const [isLoadingRequest, setIsLoadingRequest] = useState(false);
  const [requestStatus, setRequestStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleAccessRequestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAccessRequestData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitAccessRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!accessRequestData.nome || !accessRequestData.email || !accessRequestData.codigo_unidade) {
      setRequestStatus({
        type: 'error',
        message: 'Por favor, preencha todos os campos.'
      });
      return;
    }
    
    setIsLoadingRequest(true);
    try {
      // Enviar solicitação para o backend
      await api.post('/users/request-access', accessRequestData);
      
      setRequestStatus({
        type: 'success',
        message: 'Solicitação enviada com sucesso! Você receberá um email quando sua solicitação for analisada.'
      });
    } catch (error) {
      setRequestStatus({
        type: 'error',
        message: 'Erro ao enviar solicitação. Por favor, tente novamente.'
      });
      console.error('Erro ao solicitar acesso:', error);
    } finally {
      setIsLoadingRequest(false);
    }
  };

  const handleRequestAccess = () => {
    setIsRequestAccessModalOpen(true);
    // Resetar estados
    setAccessRequestData({ nome: '', email: '', codigo_unidade: '' });
    setRequestStatus({ type: null, message: '' });
  };

  const renderErrorMessage = () => {
    if (!errorMessage) return null;

    let icon;
    let bgColor = "bg-red-100";
    let textColor = "text-red-700";
    let borderColor = "border-red-200";

    switch (errorType) {
      case "credentials":
        icon = <XCircle className="h-5 w-5" />;
        break;
      case "server":
        icon = <AlertCircle className="h-5 w-5" />;
        break;
      case "connection":
        icon = <AlertCircle className="h-5 w-5" />;
        break;
      case "validation":
        icon = <Info className="h-5 w-5" />;
        bgColor = "bg-yellow-100";
        textColor = "text-yellow-700";
        borderColor = "border-yellow-200";
        break;
    }

    return (
      <div
        className={`mb-6 p-4 ${bgColor} ${textColor} rounded-lg border ${borderColor} flex items-start`}
      >
        <span className="mr-2 flex-shrink-0 mt-0.5">{icon}</span>
        <span>{errorMessage}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full bg-white">
      {/* Background com blur */}
      <div className="fixed inset-0 z-0">
        <img
          className="w-full h-full object-cover"
          alt="Fatec Votorantim"
          src={bgImage}
        />
        <div className="absolute inset-0 backdrop-blur-[4px] bg-black/20"></div>
      </div>

      {/* Conteúdo principal */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-[644px] mx-auto">
          {/* Logo responsivo */}
          <img
            className="w-[200px] md:w-[324px] h-auto mx-auto mb-4 md:mb-6"
            alt="Fatec Votorantim"
            src={logoImage}
          />

          {/* Título responsivo */}
          <h1 className="font-['Source_Sans_3',Helvetica] font-extrabold text-white text-2xl md:text-4xl text-center mb-6 md:mb-8 drop-shadow-lg px-2">
            Plano de Gestão Anual - PGA 2025
          </h1>

          {/* Card principal */}
          <Card className="w-full bg-white/95 shadow-[0px_0px_25px_#00000055] rounded-[16px] md:rounded-[21px] backdrop-blur-sm">
            <CardContent className="p-4 md:p-10">
              {/* Títulos responsivos */}
              <h2 className="font-['Source_Sans_3',Helvetica] font-extrabold text-[#2D3748] text-3xl md:text-5xl text-center mb-4 md:mb-6">
                Login
              </h2>

              <p className="font-['Source_Sans_3',Helvetica] font-normal text-[#4A5568] text-lg md:text-2xl text-center mb-6 md:mb-8 px-2">
                Entre com suas credenciais para acessar o sistema.
              </p>

              {renderErrorMessage()}

              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                {/* Campos de formulário */}
                <div>
                  <label
                    htmlFor="email"
                    className="block font-['Source_Sans_3',Helvetica] font-medium text-[#2D3748] text-base md:text-xl mb-2"
                  >
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={credentials.email}
                    onChange={handleChange}
                    placeholder="Digite seu email"
                    className={`h-[50px] md:h-[59px] text-base md:text-xl font-['Source_Sans_3',Helvetica] text-[#4A5568] bg-white rounded-lg border-[#E2E8F0] focus:border-[#ae0f0a] focus:ring-[#ae0f0a] ${
                      errorType === "validation" && !credentials.email
                        ? "border-red-500"
                        : ""
                    }`}
                  />
                </div>

                <div>
                  <label
                    htmlFor="senha"
                    className="block font-['Source_Sans_3',Helvetica] font-medium text-[#2D3748] text-base md:text-xl mb-2"
                  >
                    Senha
                  </label>
                  <Input
                    id="senha"
                    type="password"
                    value={credentials.senha}
                    onChange={handleChange}
                    placeholder="Digite sua senha"
                    className={`h-[50px] md:h-[59px] text-base md:text-xl font-['Source_Sans_3',Helvetica] text-[#4A5568] bg-white rounded-lg border-[#E2E8F0] focus:border-[#ae0f0a] focus:ring-[#ae0f0a] ${
                      errorType === "validation" && !credentials.senha
                        ? "border-red-500"
                        : ""
                    }`}
                  />
                </div>

                {/* Link Esqueci senha */}
                <div className="text-end">
                  <Button
                    type="button"
                    variant="link"
                    onClick={handleForgotPassword}
                    className="font-['Source_Sans_3',Helvetica] text-[#ae0f0a] hover:text-[#8e0c08] text-sm md:text-lg p-0"
                  >
                    Esqueci minha senha
                  </Button>
                </div>

                {/* Botão de login */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-[50px] md:h-[57px] bg-[#ae0f0a] hover:bg-[#8e0c08] rounded-lg font-['Source_Sans_3',Helvetica] font-extrabold text-white text-lg md:text-2xl transition-colors duration-200"
                >
                  {isLoading ? "Entrando..." : "Entrar"}
                </Button>

                {/* Link Solicitar acesso */}
                <div className="text-center pt-2">
                  <Button
                    type="button"
                    variant="link"
                    onClick={handleRequestAccess}
                    className="font-['Source_Sans_3',Helvetica] text-[#ae0f0a] hover:text-[#8e0c08] text-sm md:text-lg p-0"
                  >
                    Solicitar acesso ao sistema
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal de Recuperação de Senha */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Recuperação de Senha"
        className="max-w-[90%] md:max-w-md mx-auto"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleResetPassword();
          }}
        >
          <div className="space-y-4">
            <p className="text-gray-600">
              Digite seu email para receber as instruções de recuperação de
              senha.
            </p>

            {resetStatus.message && (
              <div
                className={`p-4 rounded-lg ${
                  resetStatus.type === "success"
                    ? "bg-green-100 text-green-700 border border-green-200"
                    : "bg-red-100 text-red-700 border border-red-200"
                }`}
              >
                {resetStatus.message}
              </div>
            )}

            <div>
              <label
                htmlFor="reset-email"
                className="block font-['Source_Sans_3',Helvetica] font-medium text-[#2D3748] text-lg mb-2"
              >
                Email
              </label>
              <Input
                id="reset-email"
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="Digite seu email cadastrado"
                className="h-[59px] text-lg font-['Source_Sans_3',Helvetica] text-[#4A5568] bg-white rounded-lg border-[#E2E8F0] focus:border-[#ae0f0a] focus:ring-[#ae0f0a]"
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                disabled={isLoadingReset}
                className="h-[57px] px-6 bg-[#ae0f0a] hover:bg-[#8e0c08] rounded-lg font-['Source_Sans_3',Helvetica] font-bold text-white text-lg transition-colors duration-200"
              >
                {isLoadingReset ? "Enviando..." : "Enviar"}
              </Button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Modal de Solicitação de Acesso */}
      <Modal
        isOpen={isRequestAccessModalOpen}
        onClose={() => setIsRequestAccessModalOpen(false)}
        title="Solicitar Acesso ao Sistema PGA"
        className="max-w-[90%] md:max-w-md mx-auto"
      >
        <div className="space-y-4">
          {requestStatus.type ? (
            // Feedback de sucesso ou erro
            <div className={`flex flex-col items-center text-center space-y-4 py-4 ${
              requestStatus.type === "success" ? "text-green-600" : "text-red-600"
            }`}>
              {requestStatus.type === "success" ? (
                <CheckCircle className="w-16 h-16" />
              ) : (
                <AlertCircle className="w-16 h-16" />
              )}
              <p className="text-lg font-['Source_Sans_3',Helvetica]">
                {requestStatus.message}
              </p>
              <Button
                type="button"
                onClick={() => {
                  setIsRequestAccessModalOpen(false);
                  setRequestStatus({ type: null, message: "" });
                }}
                className="mt-4"
              >
                Fechar
              </Button>
            </div>
          ) : (
            // Formulário de solicitação
            <form onSubmit={handleSubmitAccessRequest} className="space-y-4">
              <div>
                <div className="text-sm font-medium pb-1.5">Nome Completo</div>
                <Input
                  id="nome"
                  name="nome"
                  value={accessRequestData.nome}
                  onChange={handleAccessRequestChange}
                  className="mt-1"
                  placeholder="Digite seu nome completo"
                  required
                />
              </div>
              
              <div>
                <div className="text-sm font-medium pb-1.5">Email Institucional</div>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={accessRequestData.email}
                  onChange={handleAccessRequestChange}
                  className="mt-1"
                  placeholder="Digite seu email institucional"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Preferencialmente utilize seu email institucional (@fatec.sp.gov.br)
                </p>
              </div>
              
              <div>
                <div className="text-sm font-medium pb-1.5">Código da Unidade Fatec</div>
                <Input
                  id="codigo_unidade"
                  name="codigo_unidade"
                  type="text"
                  value={accessRequestData.codigo_unidade}
                  onChange={handleAccessRequestChange}
                  className="mt-1"
                  placeholder="Ex: F003 (código FNNN da sua unidade)"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Digite o código FNNN da sua unidade Fatec (ex: F003 para Fatec São Paulo)
                </p>
              </div>
              
              <div className="pt-4">
                <Button 
                  type="submit"
                  className="w-full bg-[#ae0f0a] hover:bg-[#8e0c08]"
                  disabled={isLoadingRequest}
                >
                  {isLoadingRequest ? "Enviando..." : "Solicitar Acesso"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </Modal>
    </div>
  );
};
