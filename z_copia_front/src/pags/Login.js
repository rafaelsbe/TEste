import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/login.css";

const API = "http://localhost:3000";

export default function LoginPagina() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmSenha, setConfirmSenha] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function formSubmit(e) {
    e.preventDefault();
    setErro("");
    setSucesso("");

    if (!isLogin && senha !== confirmSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    setCarregando(true);
    try {
      const url = isLogin ? `${API}/login` : `${API}/register`;
      const body = isLogin
        ? { email, senha }
        : { nome, email, senha };

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        setErro(data.erro || "Erro ao processar solicitação.");
        return;
      }

      if (isLogin) {
        localStorage.setItem("token", data.token);
        navigate("/");
      } else {
        setSucesso("Conta criada com sucesso! Faça login.");
        setIsLogin(true);
        setNome(""); setEmail(""); setSenha(""); setConfirmSenha("");
      }
    } catch (err) {
      setErro("Erro de conexão com o servidor.");
    } finally {
      setCarregando(false);
    }
  }

  function trocarModo() {
    setIsLogin(!isLogin);
    setErro(""); setSucesso("");
  }

  return (
    <div className="login_fundoTotal">
      {/* Lado esquerdo — identidade Sergás */}
      <div className="login_fundoLogo">
        <div className="login_logo_conteudo">
          <div className="login_logo_circulo">
            <img src="/logo.png" alt="Sergás" onError={e => { e.target.style.display='none'; }} />
            <span className="login_logo_sigla">S</span>
          </div>
          <h1 className="login_empresa">Sergás</h1>
          <p className="login_subtitulo">Sistema de Chamados</p>
          <div className="login_divider" />
          <p className="login_descricao">
            Abra e acompanhe seus chamados de suporte de forma rápida e simples.
          </p>
        </div>
      </div>

      {/* Lado direito — formulário */}
      <div className="login_fundoForm">
        <div className="login_card">
          <h2 className="login_titulo">{isLogin ? "Entrar" : "Criar conta"}</h2>
          <p className="login_subtexto">
            {isLogin ? "Acesse com suas credenciais" : "Preencha os dados abaixo"}
          </p>

          {erro && <div className="login_alerta login_alerta_erro">{erro}</div>}
          {sucesso && <div className="login_alerta login_alerta_sucesso">{sucesso}</div>}

          <form className="login_form" onSubmit={formSubmit}>
            {!isLogin && (
              <div className="login_campo">
                <label>Nome completo</label>
                <input
                  type="text"
                  placeholder="Seu nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="login_campo">
              <label>E-mail</label>
              <input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="login_campo">
              <label>Senha</label>
              <input
                type="password"
                placeholder="••••••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
            </div>

            {!isLogin && (
              <div className="login_campo">
                <label>Confirmar senha</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmSenha}
                  onChange={(e) => setConfirmSenha(e.target.value)}
                  required
                />
              </div>
            )}

            <button className="login_btn_submit" type="submit" disabled={carregando}>
              {carregando ? "Aguarde..." : isLogin ? "Entrar" : "Criar conta"}
            </button>
          </form>

          <button className="login_btn_trocar" onClick={trocarModo}>
            {isLogin ? "Não tem conta? Cadastre-se" : "Já tem conta? Faça login"}
          </button>
        </div>
      </div>
    </div>
  );
}
