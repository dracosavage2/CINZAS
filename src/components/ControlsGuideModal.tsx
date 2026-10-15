import React from 'react';
import { X, Zap, Shield, Sparkles, ChevronRight, Hourglass, Swords } from 'lucide-react';

interface ControlsGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ControlsGuideModal: React.FC<ControlsGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl rounded-lg border-2 border-slate-700 bg-zinc-950 p-6 shadow-2xl text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-zinc-800 transition-colors"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="font-cinzel text-xl font-bold uppercase tracking-wider text-cyan-400 mb-1 flex items-center gap-2">
          <Swords className="w-5 h-5 text-amber-400" /> Guia do Duelo Por Turnos
        </h2>
        <p className="text-xs text-slate-400 mb-4">
          Combate 100% tático por turnos com cartas, habilidades visuais e reações dinâmicas.
        </p>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-2.5 rounded bg-zinc-900 border border-zinc-800">
            <div>
              <span className="text-slate-300 block font-semibold">Jogar Cartas de Habilidade / Poder</span>
              <span className="text-[10px] text-slate-500">Gaste sua Mana jogando qualquer carta disponível na mão</span>
            </div>
            <div className="flex items-center gap-1 font-mono text-cyan-300 font-bold">
              <kbd className="px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700">1</kbd>
              <kbd className="px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700">2</kbd>
              <kbd className="px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700">3</kbd>
              <kbd className="px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700">4</kbd>
              <kbd className="px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700">5</kbd>
            </div>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded bg-zinc-900 border border-zinc-800">
            <div>
              <span className="text-slate-300 block font-semibold">Passagem Automática de Turno</span>
              <span className="text-[10px] text-cyan-400 font-medium">Após soltar a skill, o jogo passa automaticamente para o próximo jogador (Boss)!</span>
            </div>
            <span className="text-xs font-mono text-cyan-400 font-bold px-2 py-1 bg-cyan-950/60 border border-cyan-600/50 rounded">
              AUTOMÁTICO
            </span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded bg-zinc-900 border border-zinc-800">
            <div>
              <span className="text-slate-300 block font-semibold">Passar a Vez (Opcional)</span>
              <span className="text-[10px] text-slate-500">Pressione Espaço ou clique em Passar Vez se quiser poupar ações</span>
            </div>
            <span className="text-xs font-mono text-amber-400 font-bold px-2 py-1 bg-amber-950/60 border border-amber-600/50 rounded">
              [ESPAÇO] (Opcional)
            </span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded bg-zinc-900 border border-zinc-800">
            <div>
              <span className="text-slate-300 block font-semibold">Mana Renovada a Cada Turno</span>
              <span className="text-[10px] text-slate-500">No início do seu turno, sua Mana é restaurada ao máximo</span>
            </div>
            <span className="text-xs font-mono text-cyan-400 font-bold">3/3 Mana por Turno</span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded bg-zinc-900 border border-zinc-800">
            <div>
              <span className="text-slate-300 block font-semibold">Intenção do Boss (Previsão Tática)</span>
              <span className="text-[10px] text-slate-500">Observe a insígnia flutuante sobre a cabeça do boss</span>
            </div>
            <span className="text-xs font-mono text-rose-400 font-bold">⚔️ Dano / 🛡️ Escudo</span>
          </div>
        </div>

        <div className="mt-5 p-3 rounded bg-blue-950/40 border border-blue-900/60 text-xs text-blue-200">
          <strong className="font-cinzel block text-amber-300 mb-1">Estratégia Recomendada:</strong>
          Se o Boss pretende desferir um golpe poderoso (indicado em vermelho acima dele), ative a carta de <strong>Escudo Rúnico</strong> para absorver o impacto! Se o Boss for erguer um escudo, aproveite para desferir <strong>Bola de Energia</strong>, <strong>Chuva de Cartas</strong> ou a devastadora <strong>Explosão Cósmica</strong>!
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-cyan-900/80 hover:bg-cyan-800 text-white font-cinzel font-bold text-xs transition-colors"
          >
            Entendido, Iniciar Duelo
          </button>
        </div>
      </div>
    </div>
  );
};
