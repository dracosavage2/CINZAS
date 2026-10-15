import React, { useState } from 'react';
import chestImgSrc from '../assets/images/gothic_reward_chest_1792034816459.jpg';
import { RotateCcw, Sparkles, Trophy, Gift, ArrowRight, Home } from 'lucide-react';

interface VictoryDefeatOverlayProps {
  status: 'VICTORY' | 'DEFEAT' | null;
  onRestart: () => void;
  onNextBoss?: () => void;
  onBackToMenu?: () => void;
  currentBossId?: number;
  playerScore: number;
}

export const VictoryDefeatOverlay: React.FC<VictoryDefeatOverlayProps> = ({
  status,
  onRestart,
  onNextBoss,
  onBackToMenu,
  currentBossId = 1,
  playerScore
}) => {
  const [chestOpened, setChestOpened] = useState(false);

  if (!status) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg animate-in fade-in duration-700">
      {status === 'DEFEAT' ? (
        // DARK SOULS DEFEAT SCREEN
        <div className="flex flex-col items-center text-center max-w-lg px-6">
          <h1 className="font-cinzel text-4xl sm:text-6xl font-black tracking-widest text-red-600 text-glow-red uppercase">
            VOCÊ MORREU
          </h1>
          <div className="w-48 h-0.5 bg-gradient-to-r from-transparent via-red-600 to-transparent my-4" />
          <p className="text-sm text-slate-400 font-cinzel italic tracking-wide">
            Sua alma dissolveu-se nas sombras carmesins do castelo esquecido.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
            <button
              onClick={onRestart}
              className="flex-1 max-w-xs flex items-center justify-center gap-2.5 px-6 py-3 rounded border border-red-800 bg-red-950/80 hover:bg-red-900 text-rose-100 font-cinzel font-bold text-sm tracking-widest uppercase transition-all duration-200 hover:scale-105 shadow-[0_0_25px_rgba(220,38,38,0.5)]"
            >
              <RotateCcw className="w-4 h-4" />
              Renascer na Fogueira
            </button>
            {onBackToMenu && (
              <button
                onClick={onBackToMenu}
                className="flex-1 max-w-xs flex items-center justify-center gap-2 px-5 py-3 rounded border border-zinc-800 bg-zinc-900/90 hover:bg-zinc-800 text-slate-300 font-cinzel font-bold text-sm tracking-wider uppercase transition-colors"
              >
                <Home className="w-4 h-4 text-red-400" />
                Menu Principal
              </button>
            )}
          </div>
        </div>
      ) : (
        // DARK SOULS VICTORY SCREEN
        <div className="flex flex-col items-center text-center max-w-2xl px-6">
          <h1 className="font-cinzel text-3xl sm:text-5xl font-black tracking-widest text-amber-400 text-glow-gold uppercase">
            VITÓRIA ALCANÇADA
          </h1>
          <div className="w-64 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent my-4" />
          <p className="text-sm text-slate-300 font-cinzel tracking-wider">
            O Lorde das Sombras ruiu em cinzas. A maldição do sangue foi quebrada.
          </p>

          {/* Loot Chest Section (from image.png Drop/Recompensa) */}
          <div className="mt-6 flex flex-col items-center bg-zinc-950/80 border border-amber-900/60 p-5 rounded-lg max-w-md w-full shadow-2xl">
            <div className="relative w-44 h-44 rounded-lg overflow-hidden border-2 border-amber-500/80 shadow-[0_0_30px_rgba(245,158,11,0.5)] mb-3 bg-black">
              <img
                src={chestImgSrc}
                alt="Baú de Relíquias de Ébano"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover scale-105"
              />
              {!chestOpened && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="text-xs font-cinzel font-bold text-amber-200 bg-black/70 px-2 py-1 rounded border border-amber-500/50">
                    Toque para Abrir
                  </span>
                </div>
              )}
            </div>

            {!chestOpened ? (
              <button
                onClick={() => setChestOpened(true)}
                className="w-full py-2.5 px-4 rounded bg-amber-600 hover:bg-amber-500 text-slate-950 font-cinzel font-black text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-2 shadow-lg"
              >
                <Gift className="w-4 h-4" />
                Reclamar Recompensa do Boss
              </button>
            ) : (
              <div className="w-full flex flex-col items-center animate-in zoom-in-95 duration-300">
                <div className="flex items-center gap-2 text-amber-400 font-cinzel font-bold text-sm mb-2">
                  <Sparkles className="w-4 h-4" />
                  Tesouro do Guardião Desbloqueado!
                </div>
                <div className="grid grid-cols-2 gap-2 w-full text-xs text-left mb-3">
                  <div className="bg-zinc-900 p-2 rounded border border-zinc-800">
                    <span className="text-slate-400 block text-[10px]">Almas do Lorde</span>
                    <span className="font-mono-numbers font-bold text-amber-300">+5.000 Almas</span>
                  </div>
                  <div className="bg-zinc-900 p-2 rounded border border-zinc-800">
                    <span className="text-slate-400 block text-[10px]">Nova Carta Rara</span>
                    <span className="font-mono font-bold text-cyan-300">Explosão Cósmica</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-2 w-full">
                  {onNextBoss && currentBossId === 1 && (
                    <button
                      onClick={onNextBoss}
                      className="flex-1 w-full py-2.5 px-4 rounded border border-purple-600 bg-purple-950/90 hover:bg-purple-800 text-purple-200 font-cinzel font-bold text-xs tracking-wider uppercase transition-all shadow-[0_0_15px_rgba(168,85,247,0.5)] flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      Desafiar 2º Boss: Lorde do Vazio
                    </button>
                  )}
                  <button
                    onClick={onRestart}
                    className="flex-1 w-full py-2.5 px-4 rounded border border-slate-700 bg-zinc-900 hover:bg-zinc-800 text-white font-cinzel font-bold text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Batalhar Novamente
                  </button>
                  {onBackToMenu && (
                    <button
                      onClick={onBackToMenu}
                      className="py-2.5 px-4 rounded border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-slate-300 font-cinzel font-bold text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-2"
                    >
                      <Home className="w-4 h-4 text-amber-400" />
                      Menu
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
