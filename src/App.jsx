import { useState, useEffect } from "react";

const MATERIAS = [
  { id: 1, nome: "Língua Portuguesa", emoji: "📝", cor: "#f97316", corLight: "#fff7ed" },
  { id: 2, nome: "Legislação Ebserh", emoji: "🏥", cor: "#3b82f6", corLight: "#eff6ff" },
  { id: 3, nome: "Legislação SUS", emoji: "⚕️", cor: "#10b981", corLight: "#ecfdf5" },
  { id: 4, nome: "Enfermagem", emoji: "💉", cor: "#ec4899", corLight: "#fdf2f8" },
  { id: 5, nome: "Raciocínio Lógico", emoji: "🧠", cor: "#8b5cf6", corLight: "#f5f3ff" },
];

const FASES = [
  { id: 0, label: "Leitura", icon: "📖", desc: "Dia 1 — Leitura passiva do PDF na íntegra", meta: null },
  { id: 1, label: "Questões Fáceis", icon: "✏️", desc: "Dia 2 — 30 questões fáceis (A,B,C,D,E)", meta: 80 },
  { id: 2, label: "Revisão", icon: "🔁", desc: "Dia 3 — 30 questões fáceis + médias", meta: 85 },
  { id: 3, label: "7 dias", icon: "⏱️", desc: "Espaçamento 7 dias — questões médias/difíceis", meta: 90 },
  { id: 4, label: "7 dias #2", icon: "⏱️", desc: "Espaçamento 7 dias — 2ª vez", meta: 90 },
  { id: 5, label: "7 dias #3", icon: "⏱️", desc: "Espaçamento 7 dias — 3ª vez", meta: 90 },
  { id: 6, label: "15 dias", icon: "🏁", desc: "Espaçamento 15 dias — misto (15 questões por assunto)", meta: 95 },
];

const FASES_LABEL_CURTO = ["Leitura", "Fácil", "Revisão", "7d #1", "7d #2", "7d #3", "15d"];

function getFaseColor(faseId, cor) {
  if (faseId === 6) return "#fbbf24";
  return cor;
}

function ProgressBar({ value, meta, cor }) {
  const pct = Math.min(value, 100);
  const ok = meta ? value >= meta : true;
  return (
    <div style={{ position: "relative", height: 8, borderRadius: 99, background: "#e5e7eb", overflow: "hidden" }}>
      <div style={{
        height: "100%", borderRadius: 99,
        width: `${pct}%`,
        background: ok ? cor : "#f87171",
        transition: "width 0.4s ease"
      }} />
      {meta && (
        <div style={{
          position: "absolute", top: -2, bottom: -2,
          left: `${meta}%`, width: 2,
          background: "#374151", borderRadius: 99, opacity: 0.4
        }} />
      )}
    </div>
  );
}

function Modal({ assunto, materiaId, onClose, onSave }) {
  const materia = MATERIAS.find(m => m.id === materiaId);
  const [nome, setNome] = useState(assunto.nome || "");
  const [faseAtual, setFaseAtual] = useState(assunto.faseAtual ?? 0);
  const [porcentagem, setPorcentagem] = useState(assunto.porcentagem ?? 0);
  const [historico, setHistorico] = useState(assunto.historico || []);
  const fase = FASES[faseAtual];

  function avancar() {
    const meta = fase.meta;
    if (meta && porcentagem < meta) return;
    const novoHistorico = [...historico, { fase: faseAtual, pct: porcentagem }];
    const novaFase = Math.min(faseAtual + 1, FASES.length - 1);
    setHistorico(novoHistorico);
    setFaseAtual(novaFase);
    setPorcentagem(0);
  }

  function salvar() {
    onSave({ ...assunto, nome, faseAtual, porcentagem, historico });
    onClose();
  }

  const podeAvancar = !fase.meta || porcentagem >= fase.meta;
  const concluido = faseAtual === FASES.length - 1 && historico.length >= FASES.length - 1;

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 1000, padding: 16
    }} onClick={onClose}>
      <div style={{
        background: "#fff", borderRadius: 20, padding: 28, width: "100%", maxWidth: 440,
        boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        fontFamily: "'Sora', sans-serif"
      }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <span style={{ fontSize: 24 }}>{materia.emoji}</span>
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontSize: 11, color: materia.cor, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>{materia.nome}</p>
            <p style={{ margin: 0, fontSize: 13, color: "#6b7280" }}>Editar assunto</p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#9ca3af" }}>✕</button>
        </div>

        {/* Nome */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>NOME DO ASSUNTO</label>
          <input
            value={nome}
            onChange={e => setNome(e.target.value)}
            placeholder="Ex: Concordância verbal"
            style={{
              width: "100%", padding: "10px 12px", borderRadius: 10, border: "1.5px solid #e5e7eb",
              fontSize: 14, outline: "none", fontFamily: "inherit", boxSizing: "border-box",
              transition: "border-color 0.2s"
            }}
            onFocus={e => e.target.style.borderColor = materia.cor}
            onBlur={e => e.target.style.borderColor = "#e5e7eb"}
          />
        </div>

        {/* Fase atual */}
        <div style={{ background: materia.corLight, borderRadius: 12, padding: 14, marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 18 }}>{fase.icon}</span>
            <div>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#1f2937" }}>{fase.label}</p>
              <p style={{ margin: 0, fontSize: 11, color: "#6b7280" }}>{fase.desc}</p>
            </div>
          </div>
          {fase.meta && (
            <p style={{ margin: "6px 0 0", fontSize: 11, color: materia.cor, fontWeight: 600 }}>
              Meta: ≥{fase.meta}% de acertos
            </p>
          )}
        </div>

        {/* Porcentagem */}
        {fase.meta && (
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
              ACERTOS NESTA FASE: {porcentagem}%
            </label>
            <input
              type="range" min={0} max={100} value={porcentagem}
              onChange={e => setPorcentagem(Number(e.target.value))}
              style={{ width: "100%", accentColor: materia.cor }}
            />
            <ProgressBar value={porcentagem} meta={fase.meta} cor={materia.cor} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
              <span style={{ fontSize: 11, color: "#9ca3af" }}>0%</span>
              <span style={{ fontSize: 11, color: "#9ca3af" }}>Meta: {fase.meta}%</span>
              <span style={{ fontSize: 11, color: "#9ca3af" }}>100%</span>
            </div>
          </div>
        )}

        {/* Histórico */}
        {historico.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 8 }}>HISTÓRICO</p>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {historico.map((h, i) => (
                <div key={i} style={{
                  padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 600,
                  background: h.pct >= (FASES[h.fase].meta ?? 100) ? materia.cor : "#f87171",
                  color: "#fff"
                }}>
                  {FASES_LABEL_CURTO[h.fase]}: {h.pct}%
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Botões */}
        <div style={{ display: "flex", gap: 8 }}>
          {!concluido && (
            <button onClick={avancar} disabled={!podeAvancar} style={{
              flex: 1, padding: "11px", borderRadius: 12, border: "none",
              background: podeAvancar ? materia.cor : "#e5e7eb",
              color: podeAvancar ? "#fff" : "#9ca3af",
              fontWeight: 700, fontSize: 13, cursor: podeAvancar ? "pointer" : "not-allowed",
              fontFamily: "inherit", transition: "all 0.2s"
            }}>
              {faseAtual === 0 ? "✅ Leitura feita — avançar" : `🎲 Avançar (${porcentagem}% ${podeAvancar ? "≥" : "<"} ${fase.meta}%)`}
            </button>
          )}
          {concluido && (
            <div style={{
              flex: 1, padding: 11, borderRadius: 12,
              background: "#fbbf24", color: "#92400e",
              fontWeight: 700, fontSize: 13, textAlign: "center"
            }}>🏆 Assunto concluído!</div>
          )}
          <button onClick={salvar} style={{
            padding: "11px 18px", borderRadius: 12, border: `2px solid ${materia.cor}`,
            background: "#fff", color: materia.cor, fontWeight: 700, fontSize: 13,
            cursor: "pointer", fontFamily: "inherit"
          }}>Salvar</button>
        </div>
      </div>
    </div>
  );
}

function CasaTabuleiro({ assunto, materia, index, onClick }) {
  const fase = FASES[assunto.faseAtual ?? 0];
  const concluido = (assunto.historico?.length ?? 0) >= FASES.length - 1;
  const iniciado = assunto.nome || (assunto.faseAtual ?? 0) > 0;

  return (
    <div onClick={onClick} style={{
      background: concluido ? "#fef3c7" : iniciado ? materia.corLight : "#f9fafb",
      border: `2px solid ${concluido ? "#fbbf24" : iniciado ? materia.cor : "#e5e7eb"}`,
      borderRadius: 14, padding: "12px 14px", cursor: "pointer",
      transition: "all 0.2s", position: "relative",
      boxShadow: iniciado ? `0 4px 12px ${materia.cor}22` : "none"
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 8px 20px ${materia.cor}33`; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = iniciado ? `0 4px 12px ${materia.cor}22` : "none"; }}
    >
      {/* Número da casa */}
      <div style={{
        position: "absolute", top: -10, left: 10,
        background: concluido ? "#fbbf24" : materia.cor,
        color: "#fff", borderRadius: 99, width: 22, height: 22,
        fontSize: 11, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center"
      }}>{index + 1}</div>

      {/* Nome */}
      <p style={{
        margin: "6px 0 6px", fontSize: 12, fontWeight: 700,
        color: iniciado ? "#1f2937" : "#9ca3af",
        minHeight: 16
      }}>
        {assunto.nome || <span style={{ fontStyle: "italic", fontWeight: 400 }}>Assunto {index + 1}</span>}
      </p>

      {/* Fase badge */}
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 4,
        padding: "2px 8px", borderRadius: 99,
        background: concluido ? "#fbbf24" : iniciado ? materia.cor : "#e5e7eb",
        color: iniciado ? "#fff" : "#9ca3af",
        fontSize: 10, fontWeight: 700
      }}>
        {concluido ? "🏆" : fase.icon} {concluido ? "Concluído" : fase.label}
      </div>

      {/* Mini progresso */}
      {!concluido && iniciado && (
        <div style={{ marginTop: 8 }}>
          <div style={{ display: "flex", gap: 3 }}>
            {FASES.map((f, i) => (
              <div key={i} style={{
                flex: 1, height: 4, borderRadius: 99,
                background: i < (assunto.faseAtual ?? 0) ? materia.cor :
                  i === (assunto.faseAtual ?? 0) ? `${materia.cor}88` : "#e5e7eb"
              }} />
            ))}
          </div>
          <p style={{ margin: "3px 0 0", fontSize: 10, color: "#9ca3af" }}>
            Fase {(assunto.faseAtual ?? 0) + 1} de {FASES.length}
          </p>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [dados, setDados] = useState(() => {
    try {
      const saved = localStorage.getItem("concurso_dados");
      if (saved) return JSON.parse(saved);
    } catch {}
    return MATERIAS.reduce((acc, m) => {
      acc[m.id] = Array(8).fill(null).map((_, i) => ({ id: i, nome: "", faseAtual: 0, porcentagem: 0, historico: [] }));
      return acc;
    }, {});
  });

  const [modal, setModal] = useState(null); // { materiaId, assuntoId }
  const [materiaAberta, setMateriaAberta] = useState(null);

  useEffect(() => {
    try { localStorage.setItem("concurso_dados", JSON.stringify(dados)); } catch {}
  }, [dados]);

  function salvarAssunto(materiaId, assunto) {
    setDados(prev => ({
      ...prev,
      [materiaId]: prev[materiaId].map(a => a.id === assunto.id ? assunto : a)
    }));
  }

  function adicionarCasa(materiaId) {
    setDados(prev => ({
      ...prev,
      [materiaId]: [...prev[materiaId], { id: prev[materiaId].length, nome: "", faseAtual: 0, porcentagem: 0, historico: [] }]
    }));
  }

  // Stats
  const stats = MATERIAS.map(m => {
    const assuntos = dados[m.id] || [];
    const total = assuntos.length;
    const concluidos = assuntos.filter(a => (a.historico?.length ?? 0) >= FASES.length - 1).length;
    const emAndamento = assuntos.filter(a => a.nome && (a.faseAtual ?? 0) > 0 && (a.historico?.length ?? 0) < FASES.length - 1).length;
    return { ...m, total, concluidos, emAndamento };
  });

  const totalConcluidos = stats.reduce((s, m) => s + m.concluidos, 0);
  const totalAssuntos = stats.reduce((s, m) => s + m.total, 0);

  return (
    <div style={{ fontFamily: "'Sora', sans-serif", minHeight: "100vh", background: "#f8fafc" }}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
        padding: "24px 20px 20px", color: "#fff"
      }}>
        <p style={{ margin: "0 0 2px", fontSize: 11, color: "#94a3b8", fontWeight: 600, letterSpacing: 2, textTransform: "uppercase" }}>Concurso Ebserh</p>
        <h1 style={{ margin: "0 0 16px", fontSize: 22, fontWeight: 800, letterSpacing: -0.5 }}>🎲 Tabuleiro de Estudos</h1>

        {/* Progress geral */}
        <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 14, padding: "12px 16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: "#94a3b8" }}>Progresso geral</span>
            <span style={{ fontSize: 14, fontWeight: 800, color: "#fbbf24" }}>{totalConcluidos}/{totalAssuntos} assuntos</span>
          </div>
          <div style={{ height: 8, borderRadius: 99, background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
            <div style={{
              height: "100%", borderRadius: 99,
              width: `${totalAssuntos ? (totalConcluidos / totalAssuntos) * 100 : 0}%`,
              background: "linear-gradient(90deg, #f97316, #fbbf24)",
              transition: "width 0.5s ease"
            }} />
          </div>
        </div>
      </div>

      {/* Matérias — visão geral */}
      {!materiaAberta && (
        <div style={{ padding: "20px 16px" }}>
          <p style={{ margin: "0 0 14px", fontSize: 12, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: 1 }}>Matérias</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {stats.map(m => (
              <div key={m.id} onClick={() => setMateriaAberta(m.id)} style={{
                background: "#fff", borderRadius: 16, padding: "16px",
                border: "1.5px solid #e5e7eb", cursor: "pointer",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                transition: "all 0.2s"
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = m.cor; e.currentTarget.style.boxShadow = `0 4px 16px ${m.cor}22`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)"; }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: m.corLight, display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 22, flexShrink: 0,
                    border: `2px solid ${m.cor}33`
                  }}>{m.emoji}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 700, color: "#1f2937" }}>{m.nome}</p>
                    <div style={{ display: "flex", gap: 8 }}>
                      <span style={{ fontSize: 11, color: "#10b981", fontWeight: 600 }}>✓ {m.concluidos} concluídos</span>
                      <span style={{ fontSize: 11, color: m.cor, fontWeight: 600 }}>⟳ {m.emAndamento} em andamento</span>
                    </div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <p style={{ margin: 0, fontSize: 18, fontWeight: 800, color: m.cor }}>{m.total}</p>
                    <p style={{ margin: 0, fontSize: 10, color: "#9ca3af" }}>casas</p>
                  </div>
                </div>

                {/* Mini barra */}
                <div style={{ marginTop: 10 }}>
                  <div style={{ height: 5, borderRadius: 99, background: "#f1f5f9", overflow: "hidden" }}>
                    <div style={{
                      height: "100%", borderRadius: 99,
                      width: `${m.total ? (m.concluidos / m.total) * 100 : 0}%`,
                      background: m.cor, transition: "width 0.4s"
                    }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabuleiro de uma matéria */}
      {materiaAberta && (() => {
        const m = MATERIAS.find(x => x.id === materiaAberta);
        const assuntos = dados[materiaAberta] || [];
        return (
          <div>
            {/* Sub-header */}
            <div style={{
              background: "#fff", padding: "14px 16px",
              borderBottom: "1.5px solid #f1f5f9",
              display: "flex", alignItems: "center", gap: 12, position: "sticky", top: 0, zIndex: 10
            }}>
              <button onClick={() => setMateriaAberta(null)} style={{
                background: "#f1f5f9", border: "none", borderRadius: 10,
                width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", fontSize: 16
              }}>←</button>
              <span style={{ fontSize: 22 }}>{m.emoji}</span>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: 15, fontWeight: 800, color: "#1f2937" }}>{m.nome}</p>
                <p style={{ margin: 0, fontSize: 11, color: "#9ca3af" }}>{assuntos.length} casas no tabuleiro</p>
              </div>
            </div>

            {/* Fases legenda */}
            <div style={{ padding: "12px 16px 0", overflowX: "auto" }}>
              <div style={{ display: "flex", gap: 6, paddingBottom: 4, minWidth: "max-content" }}>
                {FASES.map((f, i) => (
                  <div key={i} style={{
                    padding: "4px 10px", borderRadius: 99, fontSize: 10, fontWeight: 700,
                    background: i === 6 ? "#fef3c7" : m.corLight,
                    color: i === 6 ? "#92400e" : m.cor,
                    border: `1.5px solid ${i === 6 ? "#fbbf24" : m.cor}44`,
                    whiteSpace: "nowrap"
                  }}>
                    {f.icon} {f.label}{f.meta ? ` ≥${f.meta}%` : ""}
                  </div>
                ))}
              </div>
            </div>

            {/* Grid de casas */}
            <div style={{ padding: "14px 16px 100px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {assuntos.map((a, i) => (
                <CasaTabuleiro
                  key={a.id}
                  assunto={a}
                  materia={m}
                  index={i}
                  onClick={() => setModal({ materiaId: m.id, assuntoId: a.id })}
                />
              ))}

              {/* Adicionar casa */}
              <div onClick={() => adicionarCasa(m.id)} style={{
                border: `2px dashed ${m.cor}66`, borderRadius: 14, padding: "20px",
                cursor: "pointer", display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center", gap: 6,
                color: m.cor, transition: "all 0.2s", minHeight: 80
              }}
                onMouseEnter={e => e.currentTarget.style.background = m.corLight}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <span style={{ fontSize: 22 }}>＋</span>
                <span style={{ fontSize: 11, fontWeight: 700 }}>Nova casa</span>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Modal */}
      {modal && (() => {
        const assunto = dados[modal.materiaId]?.find(a => a.id === modal.assuntoId);
        if (!assunto) return null;
        return (
          <Modal
            assunto={assunto}
            materiaId={modal.materiaId}
            onClose={() => setModal(null)}
            onSave={(a) => { salvarAssunto(modal.materiaId, a); setModal(null); }}
          />
        );
      })()}
    </div>
  );
}
