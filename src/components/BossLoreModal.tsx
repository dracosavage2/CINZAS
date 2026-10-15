import React from 'react';
import { X, ShieldAlert, Zap, Skull, Flame, Wind, Eye } from 'lucide-react';
import bossSpriteImg from '../assets/images/boss_lorde_sombras_1792034816590.jpg';

interface BossLoreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BossLoreModal: React.FC<BossLoreModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const skills = [
    {
      id: 1,
      name: 'Golpe com Bastão',
      icon: Zap,
      type: 'Ataque Físico / Caos',
      desc: 'Um golpe devastador com seu cajado forjado no abismo que emite uma lâmina crescente de chamas escarlates. Requer esquiva rápida ou salto.'
    },
    {
      id: 2,
      name: 'Rajada de Sombras',
      icon: Skull,
      type: 'Projéteis Mágicos',
      desc: 'Canaliza o cajado das trevas para disparar salvas de projéteis velozes em direção ao herói.'
    },
    {
      id: 3,
      name: 'Invocar Corvos',
      icon: Wind,
      type: 'Enxame Aéreo',
      desc: 'Grita aos corvos do castelo esquecido, criando uma revoada que cruza o campo em ondas sinuosas.'
    },
    {
      id: 4,
      name: 'Ataque Aéreo',
      icon: Flame,
      type: 'Queda e Impacto',
      desc: 'Salta nas nuvens de sangue e despenca com força sísmica, gerando pilares flamejantes sobre a ponte.'
    },
    {
      id: 5,
      name: 'Zona de Dano (Área)',
      icon: Eye,
      type: 'Armadilha Rúnica',
      desc: 'Marca o chão com selos demoníacos que explodem após 1,2 segundos. O jogador deve sair da área imediatamente.'
    },
    {
      id: 6,
      name: 'Teleporte Sombrio',
      icon: ShieldAlert,
      type: 'Mobilidade Abissal',
      desc: 'Dissolve seu corpo em fumaça carmesim e rematerializa-se no flanco oposto da arena para contra-atacar.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-lg border-2 border-red-900/80 bg-zinc-950 p-6 shadow-[0_0_50px_rgba(185,28,28,0.4)] text-slate-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-zinc-800 transition-colors"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center gap-5 border-b border-red-950/80 pb-5">
          <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-red-600 shadow-[0_0_20px_rgba(239,68,68,0.5)] shrink-0 bg-red-950">
            <img
              src={bossSpriteImg}
              alt="Lorde das Sombras"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-top scale-125"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-cinzel text-xl sm:text-2xl font-bold tracking-widest text-red-500 text-glow-red uppercase">
                Lorde das Sombras
              </h2>
              <span className="text-xs px-2 py-0.5 rounded bg-red-950/80 border border-red-700/60 text-rose-300 font-semibold font-cinzel">
                Boss Épico
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 italic leading-relaxed">
              &quot;O Lorde das Sombras é o guardião do castelo esquecido. Sua presença corrói a esperança e transforma a luz em trevas.&quot;
            </p>

            {/* Boss Attributes (from image.png) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 text-xs">
              <div className="bg-zinc-900/90 border border-zinc-800 p-2 rounded">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">HP</span>
                <span className="font-mono font-bold text-red-400">420 / 420</span>
              </div>
              <div className="bg-zinc-900/90 border border-zinc-800 p-2 rounded">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Dano</span>
                <span className="font-mono font-bold text-amber-400">Alto (Sombrio)</span>
              </div>
              <div className="bg-zinc-900/90 border border-zinc-800 p-2 rounded">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Defesa</span>
                <span className="font-mono font-bold text-blue-400">Alta (Armadura)</span>
              </div>
              <div className="bg-zinc-900/90 border border-zinc-800 p-2 rounded">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Atributo</span>
                <span className="font-mono font-bold text-purple-400">Sombras / Caos</span>
              </div>
            </div>
          </div>
        </div>

        {/* Skills & Efeitos Grid */}
        <div className="mt-5">
          <h3 className="font-cinzel text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-amber-400" />
            Grimório do Guardião: Habilidades & Efeitos
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {skills.map((skill) => {
              const Icon = skill.icon;
              return (
                <div
                  key={skill.id}
                  className="bg-zinc-900/60 border border-zinc-800/80 hover:border-red-900/80 p-3 rounded-md transition-colors"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className="p-1 rounded bg-red-950/80 border border-red-700/60 text-red-400">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-cinzel text-xs font-bold text-slate-100">
                      {skill.id}. {skill.name}
                    </span>
                    <span className="ml-auto text-[10px] text-zinc-400 font-mono">
                      {skill.type}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-snug">
                    {skill.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Advice */}
        <div className="mt-5 pt-3 border-t border-zinc-800 flex items-center justify-between text-xs text-slate-400">
          <span>Dica Souls: Use [Shift] para Esquiva com i-frames durante os golpes do cajado.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-red-900/80 hover:bg-red-800 text-white font-cinzel font-bold text-xs transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
