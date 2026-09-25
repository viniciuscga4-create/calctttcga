import React, { useState, useEffect } from "react";
import { MapPin, Palette, Gauge, Droplet, Users, Ruler, Settings, Save, RotateCcw, Plus, Minus, ChevronDown, ChevronUp } from "lucide-react";
import "./App.css";

const DEFAULT_WEIGHTS = {
  local: {
    "Antebraço": 5,
    "Braço (parte externa)": 5,
    "Braço inteiro (interno e externo)": 12,
    "Panturrilha": 6,
    "Coxa": 4,
    "Perna inteira (interna e externa)": 12,
    "Ombro": 6,
    "Costas": 8,
    "Peito": 9,
    "Costelas": 14,
    "Mão / Dedos": 16,
    "Pé": 10,
    "Pescoço": 16,
    "Rosto": 18,
  },
  estilo: {
    "Fineline": 12,
    "Old School": 15,
    "Blackwork": 18,
    "Geométrico": 18,
    "Aquarela": 22,
    "Mini Realismo": 25,
    "Surrealismo": 32,
    "Realismo": 35,
  },
  dificuldade: {
    "Baixo": 5,
    "Médio": 10,
    "Alto": 18,
    "Muito Alto": 28,
  },
  cor: {
    "Preto e Cinza": 10,
    "Colorida": 22,
  },
  personagemBase: 10,
  personagemAdicional: 6,
};

const STORAGE_KEY = "vini-calc-orcamento-pesos";

function formatBRL(value) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function RegisterMark({ className = "" }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" className={className} style={{ color: "var(--stencil-dim)" }}>
      <circle cx="7" cy="7" r="5.5" fill="none" stroke="currentColor" strokeWidth="1" />
      <line x1="7" y1="0" x2="7" y2="14" stroke="currentColor" strokeWidth="1" />
      <line x1="0" y1="7" x2="14" y2="7" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

export default function TattooBudgetCalculator() {
  const [weights, setWeights] = useState(DEFAULT_WEIGHTS);
  const [local, setLocal] = useState(Object.keys(DEFAULT_WEIGHTS.local)[0]);
  const [estilo, setEstilo] = useState("Mini Realismo");
  const [dificuldade, setDificuldade] = useState("Médio");
  const [cor, setCor] = useState("Preto e Cinza");
  const [personagens, setPersonagens] = useState(1);
  const [tamanho, setTamanho] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");

  useEffect(() => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      const parsed = JSON.parse(saved);
      setWeights((prev) => ({ ...prev, ...parsed }));
    }
  } catch (e) {
    // Nenhuma configuração salva ainda — mantém os valores padrão
  }
}, []);

  const updateWeight = (category, key, value) => {
    const num = parseFloat(value);
    setWeights((prev) => ({
      ...prev,
      [category]: { ...prev[category], [key]: isNaN(num) ? 0 : num },
    }));
  };

  const updateFlat = (key, value) => {
    const num = parseFloat(value);
    setWeights((prev) => ({ ...prev, [key]: isNaN(num) ? 0 : num }));
  };

const handleSave = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(weights));
    setSaveStatus("Valores salvos.");
  } catch (e) {
    setSaveStatus("Não foi possível salvar agora.");
  }
  setTimeout(() => setSaveStatus(""), 2500);
};

 const handleReset = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {}

  setWeights(JSON.parse(JSON.stringify(DEFAULT_WEIGHTS)));
  setSaveStatus("Valores restaurados ao padrão.");
  setTimeout(() => setSaveStatus(""), 2500);
};

  const localVal = weights.local[local] || 0;
  const estiloVal = weights.estilo[estilo] || 0;
  const dificuldadeVal = weights.dificuldade[dificuldade] || 0;
  const corVal = weights.cor[cor] || 0;
  const personagensVal = weights.personagemBase + weights.personagemAdicional * Math.max(0, personagens - 1);
  const soma = localVal + estiloVal + dificuldadeVal + corVal + personagensVal;
  const tamanhoNum = parseFloat(tamanho) || 0;
  const total = soma * tamanhoNum;

  const selectClass =
    "w-full bg-surface2 border border-surface2 focus-stencil rounded-lg px-3 py-2.5 text-ink text-sm outline-none transition-colors appearance-none";
  const labelClass = "flex items-center gap-2 text-xs uppercase tracking-widest text-stencil font-bold mb-1.5";

  return (
    <div className="bg-app min-h-full w-full flex justify-center px-4 py-8">
      <style>{`
        :root {
          --bg: #17151a;
          --surface: #211d26;
          --surface2: #2a2530;
          --stencil: #69c0cb;
          --stencil-dim: #2d9599;
          --gold: #d9b26b;
          --text: #efe9e2;
          --text-muted: #9891a0;
        }
        .bg-app { background: var(--bg); }
        .bg-surface { background: var(--surface); }
        .bg-surface2 { background: var(--surface2); }
        .text-stencil { color: var(--stencil); }
        .text-gold { color: var(--gold); }
        .text-ink { color: var(--text); }
        .text-muted2 { color: var(--text-muted); }
        .border-surface2 { border-color: var(--surface2); }
        .border-stencil-dim { border-color: var(--stencil-dim); }
        .font-mono-num {
          font-family: ui-monospace, 'SF Mono', 'Cascadia Code', 'Roboto Mono', monospace;
          font-variant-numeric: tabular-nums;
        }
        .focus-stencil:focus {
          border-color: var(--stencil) !important;
          box-shadow: 0 0 0 3px rgba(168,154,222,0.18);
        }
        select.selecthide::-ms-expand { display: none; }
        .ticket-edge {
          background-image: repeating-linear-gradient(90deg, var(--surface2) 0 6px, transparent 6px 12px);
          height: 1px;
        }
      `}</style>

      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-7">
          <p className="text-stencil text-xs uppercase font-bold mb-2" style={{ letterSpacing: "0.35em" }}>Vini Art Studio</p>
          <h1 className="text-ink text-2xl font-bold tracking-tight">Calculadora de Orçamento</h1>
          <p className="text-muted2 text-xs mt-2 font-mono-num">
            (Local + Estilo + Dificuldade + Cor + Personagens) × Tamanho
          </p>
        </div>

        {/* Card de entrada */}
        <div className="bg-surface rounded-2xl p-5 relative border border-surface2">
          <RegisterMark className="absolute -top-2 -left-2" />
          <RegisterMark className="absolute -top-2 -right-2" />

          <div className="space-y-4">
            <div>
              <label className={labelClass}><MapPin size={13} /> Local do corpo</label>
              <select className={selectClass + " selecthide"} value={local} onChange={(e) => setLocal(e.target.value)}>
                {Object.keys(weights.local).map((k) => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}><Palette size={13} /> Estilo da tatuagem</label>
              <select className={selectClass + " selecthide"} value={estilo} onChange={(e) => setEstilo(e.target.value)}>
                {Object.keys(weights.estilo).map((k) => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}><Gauge size={13} /> Nível de dificuldade / detalhe</label>
              <select className={selectClass + " selecthide"} value={dificuldade} onChange={(e) => setDificuldade(e.target.value)}>
                {Object.keys(weights.dificuldade).map((k) => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}><Droplet size={13} /> Cor</label>
              <div className="grid grid-cols-2 gap-2">
                {Object.keys(weights.cor).map((k) => (
                  <button
                    key={k}
                    onClick={() => setCor(k)}
                    className={
                      "rounded-lg px-3 py-2.5 text-sm border transition-colors " +
                      (cor === k
                        ? "bg-surface2 border-stencil-dim text-ink"
                        : "bg-surface2 border-surface2 text-muted2 hover:text-ink")
                    }
                    style={cor === k ? { borderColor: "var(--stencil)" } : {}}
                  >
                    {k}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className={labelClass}><Users size={13} /> Quantidade de personagens</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setPersonagens((p) => Math.max(1, p - 1))}
                  className="w-10 h-10 shrink-0 rounded-lg bg-surface2 border border-surface2 flex items-center justify-center text-ink hover:border-stencil-dim transition-colors"
                  aria-label="Diminuir quantidade de personagens"
                >
                  <Minus size={15} />
                </button>
                <div className="flex-1 text-center text-ink text-lg font-mono-num">{personagens}</div>
                <button
                  onClick={() => setPersonagens((p) => p + 1)}
                  className="w-10 h-10 shrink-0 rounded-lg bg-surface2 border border-surface2 flex items-center justify-center text-ink hover:border-stencil-dim transition-colors"
                  aria-label="Aumentar quantidade de personagens"
                >
                  <Plus size={15} />
                </button>
              </div>
            </div>

            <div>
              <label className={labelClass}><Ruler size={13} /> Tamanho da tatuagem (cm)</label>
              <input
                type="number"
                inputMode="decimal"
                step="0.5"
                min="0"
                placeholder="Ex: 12"
                value={tamanho}
                onChange={(e) => setTamanho(e.target.value)}
                className={selectClass + " font-mono-num"}
              />
            </div>
          </div>

          <RegisterMark className="absolute -bottom-2 -left-2" />
          <RegisterMark className="absolute -bottom-2 -right-2" />
        </div>

        {/* Card de resultado */}
        <div className="bg-surface rounded-2xl mt-4 p-5 border border-surface2">
          <div className="space-y-1.5 text-sm font-mono-num">
            <div className="flex justify-between text-muted2">
              <span>Local do corpo</span><span className="text-ink">{localVal}</span>
            </div>
            <div className="flex justify-between text-muted2">
              <span>Estilo</span><span className="text-ink">{estiloVal}</span>
            </div>
            <div className="flex justify-between text-muted2">
              <span>Dificuldade</span><span className="text-ink">{dificuldadeVal}</span>
            </div>
            <div className="flex justify-between text-muted2">
              <span>Cor</span><span className="text-ink">{corVal}</span>
            </div>
            <div className="flex justify-between text-muted2">
              <span>Personagens ({personagens})</span><span className="text-ink">{personagensVal}</span>
            </div>
          </div>

          <div className="ticket-edge my-3" />

          <div className="flex justify-between text-sm font-mono-num text-ink font-bold">
            <span>Soma dos critérios</span><span>{soma}</span>
          </div>
          <div className="flex justify-between text-sm font-mono-num text-muted2 mt-1">
            <span>× Tamanho</span><span>{tamanhoNum || 0} cm</span>
          </div>

          <div className="ticket-edge my-3" />

          <div className="flex items-baseline justify-between pt-1" style={{ transform: "rotate(-0.6deg)" }}>
            <span className="text-xs uppercase tracking-widest text-stencil font-bold">Orçamento</span>
            <span className="text-gold text-3xl font-bold font-mono-num">{formatBRL(total)}</span>
          </div>
        </div>

        {/* Configurações */}
        <button
          onClick={() => setShowSettings((s) => !s)}
          className="w-full flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-muted2 hover:text-stencil transition-colors mt-5 py-2"
        >
          <Settings size={13} />
          Ajustar valores de referência
          {showSettings ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>

        {showSettings && (
          <div className="bg-surface rounded-2xl p-5 border border-surface2 mt-2 space-y-5">
            <SettingsGroup title="Local do corpo" entries={weights.local} category="local" onChange={updateWeight} />
            <SettingsGroup title="Estilo" entries={weights.estilo} category="estilo" onChange={updateWeight} />
            <SettingsGroup title="Dificuldade" entries={weights.dificuldade} category="dificuldade" onChange={updateWeight} />
            <SettingsGroup title="Cor" entries={weights.cor} category="cor" onChange={updateWeight} />

            <div>
              <p className="text-xs uppercase tracking-widest text-stencil font-bold mb-2">Personagens</p>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs text-muted2 flex-1">Valor do 1º personagem</span>
                <input
                  type="number"
                  value={weights.personagemBase}
                  onChange={(e) => updateFlat("personagemBase", e.target.value)}
                  className="w-16 bg-surface2 border border-surface2 focus-stencil rounded px-2 py-1 text-xs text-right text-ink outline-none font-mono-num"
                />
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-muted2 flex-1">Valor por personagem adicional</span>
                <input
                  type="number"
                  value={weights.personagemAdicional}
                  onChange={(e) => updateFlat("personagemAdicional", e.target.value)}
                  className="w-16 bg-surface2 border border-surface2 focus-stencil rounded px-2 py-1 text-xs text-right text-ink outline-none font-mono-num"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={handleSave}
                className="flex-1 flex items-center justify-center gap-2 bg-surface2 hover:opacity-90 text-ink text-xs uppercase tracking-widest font-bold rounded-lg py-2.5 border border-stencil-dim transition-opacity"
              >
                <Save size={13} /> Salvar
              </button>
              <button
                onClick={handleReset}
                className="flex-1 flex items-center justify-center gap-2 bg-surface2 hover:opacity-90 text-muted2 text-xs uppercase tracking-widest font-bold rounded-lg py-2.5 border border-surface2 transition-opacity"
              >
                <RotateCcw size={13} /> Restaurar padrão
              </button>
            </div>
            {saveStatus && <p className="text-center text-xs text-stencil">{saveStatus}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

function SettingsGroup({ title, entries, category, onChange }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-widest text-stencil font-bold mb-2">{title}</p>
      <div className="space-y-1.5">
        {Object.entries(entries).map(([k, v]) => (
          <div key={k} className="flex items-center justify-between gap-2">
            <span className="text-xs text-muted2 flex-1">{k}</span>
            <input
              type="number"
              value={v}
              onChange={(e) => onChange(category, k, e.target.value)}
              className="w-16 bg-surface2 border border-surface2 focus-stencil rounded px-2 py-1 text-xs text-right text-ink outline-none font-mono-num"
            />
          </div>
        ))}
      </div>
    </div>
  );
}