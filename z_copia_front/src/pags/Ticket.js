import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../css/ticked.css";

const API = "http://localhost:3000";

export default function TicketPagina() {
  const navigate = useNavigate();
  const [mensagem, setMensagem] = useState("");
  const [grupos, setGrupos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [carregandoGrupos, setCarregandoGrupos] = useState(true);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState("");
  const [ticketCriado, setTicketCriado] = useState(null);

  useEffect(() => {
    async function carregarGrupos() {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`${API}/grupos`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }
        const data = await res.json();
        setGrupos(data.gruposFiltrados || []);
        setCategorias(data.categoriaFiltrado || []);
        setSubcategorias(data.subcategoriaFiltrado || []);
      } catch (err) {
        // grupos opcionais, não bloquear o formulário
        console.error("Erro ao carregar grupos:", err);
      } finally {
        setCarregandoGrupos(false);
      }
    }
    carregarGrupos();
  }, [navigate]);

  async function enviarTicket(e) {
    e.preventDefault();
    setErro("");

    if (!mensagem.trim()) {
      setErro("Por favor, descreva sua solicitação.");
      return;
    }

    setCarregando(true);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${API}/ticket`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ mensagem }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErro(data.erro || "Erro ao criar chamado.");
        return;
      }

      setTicketCriado(data);
      setSucesso(true);
      setMensagem("");
    } catch (err) {
      setErro("Erro de conexão com o servidor.");
    } finally {
      setCarregando(false);
    }
  }

  function novoChamado() {
    setSucesso(false);
    setTicketCriado(null);
    setErro("");
  }

  return (
    <div className="ticket_container">
      {/* Header */}
      <header className="ticket_header">
        <div className="ticket_header_logo">
          <div className="ticket_header_s">S</div>
          <span>Sergás</span>
        </div>
        <nav className="ticket_header_nav">
          <Link to="/" className="ticket_nav_link">Início</Link>
          <Link to="/ticket" className="ticket_nav_link ticket_nav_ativo">Abrir Chamado</Link>
          <button className="ticket_btn_sair" onClick={() => {
            localStorage.removeItem("token");
            navigate("/login");
          }}>Sair</button>
        </nav>
      </header>

      <main className="ticket_main">
        <div className="ticket_topo">
          <h1 className="ticket_titulo">Abrir Chamado</h1>
          <p className="ticket_subtitulo">Descreva sua solicitação com detalhes para agilizar o atendimento</p>
        </div>

        {/* Sucesso */}
        {sucesso && ticketCriado && (
          <div className="ticket_sucesso">
            <div className="ticket_sucesso_icone">✓</div>
            <h2>Chamado aberto com sucesso!</h2>
            <p>Seu chamado foi registrado no sistema.</p>
            <div className="ticket_sucesso_info">
              <div className="ticket_sucesso_dado">
                <span>Número do chamado</span>
                <strong>#{ticketCriado.id || ticketCriado.number || "—"}</strong>
              </div>
              <div className="ticket_sucesso_dado">
                <span>Título</span>
                <strong>{ticketCriado.title || "—"}</strong>
              </div>
              <div className="ticket_sucesso_dado">
                <span>Status</span>
                <strong>{ticketCriado.state || "Aberto"}</strong>
              </div>
            </div>
            <button className="ticket_btn_novo" onClick={novoChamado}>
              Abrir outro chamado
            </button>
          </div>
        )}

        {/* Formulário */}
        {!sucesso && (
          <form className="ticket_form" onSubmit={enviarTicket}>
            {erro && <div className="ticket_erro">{erro}</div>}

            {/* Grupos disponíveis (informativo) */}
            {!carregandoGrupos && grupos.length > 0 && (
              <div className="ticket_grupos">
                <p className="ticket_label_info">Grupos disponíveis no sistema:</p>
                <div className="ticket_tags">
                  {grupos.map((g) => (
                    <span key={g.id} className="ticket_tag">{g.display || g.name}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Campo de mensagem livre */}
            <div className="ticket_campo">
              <label className="ticket_label">
                Descreva sua solicitação <span className="ticket_obrig">*</span>
              </label>
              <textarea
                className="ticket_textarea"
                placeholder="Descreva detalhadamente o problema ou solicitação. Informe o que aconteceu, quando ocorreu e qualquer informação relevante..."
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
                rows={7}
                required
              />
              <span className="ticket_contador">{mensagem.length} caracteres</span>
            </div>

            <button
              type="submit"
              className="ticket_btn_enviar"
              disabled={carregando || !mensagem.trim()}
            >
              {carregando ? "Enviando..." : "Enviar Chamado"}
            </button>
          </form>
        )}
      </main>
    </div>
  );
}
