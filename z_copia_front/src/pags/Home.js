import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../css/home.css";

const API = "http://localhost:3000";

export default function HomePagina() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarUsuario() {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`${API}/usuario`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        const data = await res.json();
        if (!res.ok) throw new Error(data.erro);
        setUsuario(data);
      } catch (err) {
        setErro("Não foi possível carregar os dados do usuário.");
      } finally {
        setCarregando(false);
      }
    }
    carregarUsuario();
  }, [navigate]);

  function sair() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  function iniciais(nome) {
    if (!nome) return "?";
    return nome.split(" ").map(p => p[0]).slice(0, 2).join("").toUpperCase();
  }

  if (carregando) return (
    <div className="home_loading">
      <div className="home_spinner" />
      <p>Carregando...</p>
    </div>
  );

  return (
    <div className="home_container">
      {/* Header */}
      <header className="home_header">
        <div className="home_header_logo">
          <div className="home_header_s">S</div>
          <span>Sergás</span>
        </div>
        <nav className="home_header_nav">
          <Link to="/" className="home_nav_link home_nav_ativo">Início</Link>
          <Link to="/ticket" className="home_nav_link">Abrir Chamado</Link>
          <button className="home_btn_sair" onClick={sair}>Sair</button>
        </nav>
      </header>

      <main className="home_main">
        {/* Boas vindas */}
        <section className="home_boas_vindas">
          <div className="home_avatar">
            {iniciais(usuario?.nome)}
          </div>
          <div>
            <h1 className="home_nome">Olá, {usuario?.nome?.split(" ")[0] || "usuário"}!</h1>
            <p className="home_bem_vindo">Bem-vindo ao sistema de chamados da Sergás</p>
          </div>
        </section>

        {erro && <div className="home_erro">{erro}</div>}

        {/* Card de dados do usuário */}
        {usuario && (
          <section className="home_cards">
            <div className="home_card">
              <h3 className="home_card_titulo">Seus Dados</h3>
              <div className="home_card_corpo">
                <div className="home_dado">
                  <span className="home_dado_label">Nome</span>
                  <span className="home_dado_valor">{usuario.nome}</span>
                </div>
                <div className="home_dado">
                  <span className="home_dado_label">E-mail</span>
                  <span className="home_dado_valor">{usuario.email}</span>
                </div>
                <div className="home_dado">
                  <span className="home_dado_label">ID Zammad</span>
                  <span className="home_dado_valor home_badge">{usuario.zammadId || "—"}</span>
                </div>
                <div className="home_dado">
                  <span className="home_dado_label">Conta criada em</span>
                  <span className="home_dado_valor">
                    {usuario.createdAt
                      ? new Date(usuario.createdAt).toLocaleDateString("pt-BR")
                      : "—"}
                  </span>
                </div>
              </div>
            </div>

            {/* Ação rápida */}
            <div className="home_card home_card_acao">
              <h3 className="home_card_titulo">Precisa de ajuda?</h3>
              <p className="home_card_texto">
                Abra um chamado e nossa equipe de suporte irá atendê-lo o mais rápido possível.
              </p>
              <Link to="/ticket" className="home_btn_chamado">
                Abrir Chamado
              </Link>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
