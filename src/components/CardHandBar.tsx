import React from 'react';
import { Card, PlayerStats, TurnPhase } from '../types/game';
import { Zap, Shield, HeartPulse, Sparkles, Flame, Sword, Sun, Droplets, ChevronRight, Hourglass } from 'lucide-react';
import playerPortraitImg from '../assets/images/hero_mage_portrait_1792039214361.jpg';

interface CardHandBarProps {
  cards: Card[];
  player: PlayerStats;
  currentTurn: TurnPhase;
  turnNumber: number;
  onPlayCard: (card: Card, index: number) => void;
  onEndTurn: () => void;
  selectedCardIndex: number | null;
  isCastingSkill?: boolean;
}

const renderCardIcon = (iconName: string, className = "w-5 h-5") => {
  switch (iconName) {
    case 'Zap':
      return <Zap className={className} />;
    case 'Shield':
      return <Shield className={className} />;
    case 'HeartPulse':
      return <HeartPulse className={className} />;
    case 'Sparkles':
      return <Sparkles className={className} />;
    case 'Flame':
      return <Flame className={className} />;
    case 'Sword':
      return <Sword className={className} />;
    case 'Sun':
      return <Sun className={className} />;
    case 'Droplets':
      return <Droplets className={className} />;
    default:
      return <Zap className={className} />;
  }
};

export const CardHandBar: React.FC<CardHandBarProps> = ({
  cards,
  player,
  currentTurn,
  turnNumber,
  onPlayCard,
  onEndTurn,
  selectedCardIndex,
  isCastingSkill = false
}) => {
  const isPlayerTurn = currentTurn === 'player' && !isCastingSkill;
  const outOfMana = isPlayerTurn && player.mana === 0;

  return (
    <div className="absolute bottom-0 left-0 right-0 z-30 px-2 md:px-4 pb-1 pt-1 flex items-end justify-center pointer-events-none bg-gradient-to-t from-black/90 via-black/50 to-transparent">
      <div className="flex items-end gap-1.5 md:gap-2.5 max-w-6xl w-full justify-center overflow-x-auto pb-0.5 pointer-events-auto">
        
        {/* MANA ORB (Turn-Based Energy Core) */}
        <div className="flex flex-col items-center shrink-0 mr-0.5 mb-1">
          <div className="relative w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full bg-slate-950 border-2 border-slate-700 shadow-[0_0_12px_rgba(37,99,235,0.6)]">
            <div
              className={`absolute inset-1 rounded-full transition-all duration-300 ${
                isPlayerTurn
                  ? 'bg-radial from-cyan-400 via-blue-600 to-indigo-950 opacity-95'
                  : 'bg-radial from-slate-600 via-slate-800 to-black opacity-50'
              }`}
              style={{
                boxShadow: isPlayerTurn
                  ? `0 0 ${player.mana * 6 + 6}px rgba(59,130,246,0.8)`
                  : 'none'
              }}
            />

            <div className="relative z-10 flex flex-col items-center">
              <span className="font-cinzel text-base md:text-xl font-black text-white text-glow-blue font-mono-numbers">
                {player.mana}/{player.maxMana}
              </span>
              <span className="text-[7px] uppercase tracking-wider text-cyan-200 font-bold -mt-1">
                MANA
              </span>
            </div>
          </div>
          
          {/* Turn status indicator below mana */}
          <span className={`text-[8px] font-mono mt-0.5 font-bold px-1.5 py-0.5 rounded ${
            isCastingSkill
              ? 'bg-amber-950/90 text-amber-300 border border-amber-600/60 animate-pulse'
              : isPlayerTurn
              ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-700/50'
              : 'bg-red-950/80 text-red-300 border border-red-700/50 animate-pulse'
          }`}>
            {isCastingSkill ? 'LANÇANDO...' : isPlayerTurn ? `TURNO ${turnNumber}` : 'VEZ DO BOSS'}
          </span>
        </div>

        {/* HERO MASTER CARD (JULIOSCAESAR) */}
        <div className="hidden lg:flex flex-col w-20 md:w-24 h-26 md:h-30 rounded-md border-2 border-cyan-500/80 bg-gradient-to-b from-blue-950 via-slate-900 to-black shadow-[0_0_12px_rgba(6,182,212,0.4)] p-1 shrink-0 transition-transform hover:-translate-y-0.5">
          <div className="relative h-12 md:h-14 w-full rounded overflow-hidden border border-cyan-400/50 bg-black">
            <img
              src={playerPortraitImg}
              alt="Julioscaesar"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-top scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute top-0.5 right-0.5 px-1 rounded bg-blue-900/90 border border-blue-400 text-[6.5px] font-bold text-cyan-200">
              HERÓI
            </div>
          </div>
          <div className="flex flex-col items-center text-center mt-0.5">
            <span className="font-cinzel text-[9px] font-bold text-slate-100 uppercase tracking-wide truncate w-full">
              {player.name}
            </span>
            <span className="text-[7.5px] text-cyan-300 font-medium truncate w-full">
              Sábio das Cartas
            </span>
          </div>
          <div className="mt-auto pt-0.5 border-t border-slate-800 flex items-center justify-between text-[8px] font-mono-numbers px-0.5">
            <span className="text-cyan-400 font-bold flex items-center gap-0.5">
              <Shield className="w-2 h-2" /> {player.defense} Def
            </span>
            <span className="text-rose-400 font-bold">HP {player.hp}</span>
          </div>
        </div>

        {/* ACTIVE PLAYABLE CARDS */}
        <div className="flex items-end gap-1 md:gap-1.5">
          {cards.map((card, idx) => {
            const hasMana = player.mana >= card.cost;
            const isPlayable = isPlayerTurn && hasMana;
            const isSelected = selectedCardIndex === idx;

            return (
              <button
                key={card.id}
                onClick={() => isPlayable && onPlayCard(card, idx)}
                disabled={!isPlayable}
                aria-label={`${card.name}: Custo ${card.cost} mana. ${card.description}`}
                className={`relative group flex flex-col w-20 sm:w-22 md:w-26 h-26 sm:h-28 md:h-30 rounded-md border-2 p-1 text-left transition-all duration-150 select-none ${
                  isPlayable
                    ? 'border-slate-500/80 bg-gradient-to-b from-slate-900/95 via-zinc-950 to-black hover:-translate-y-1.5 hover:border-cyan-400 hover:shadow-[0_0_16px_rgba(56,189,248,0.5)] cursor-pointer active:scale-95'
                    : 'border-zinc-800/60 bg-zinc-950/80 opacity-50 cursor-not-allowed'
                } ${isSelected ? 'ring-2 ring-cyan-400 -translate-y-1.5' : ''}`}
              >
                {/* Hotkey Number Badge */}
                <div className="absolute -top-1.5 -left-1.5 z-20 w-4 h-4 rounded-full bg-zinc-900 border border-slate-500 flex items-center justify-center text-[8.5px] md:text-[9.5px] font-black text-amber-300 font-mono-numbers shadow-md">
                  {idx + 1}
                </div>

                {/* Card Artwork / Icon Area */}
                <div className={`relative h-11 sm:h-12 md:h-14 w-full rounded overflow-hidden border border-slate-700/60 bg-gradient-to-br ${card.color} flex items-center justify-center shadow-inner`}>
                  {/* Energy Cost Gem */}
                  <div className="absolute top-0.5 left-0.5 z-10 w-3.5 h-3.5 rounded-full bg-blue-950 border border-cyan-400 flex items-center justify-center text-[8px] md:text-[9px] font-black text-white font-mono-numbers shadow">
                    {card.cost}
                  </div>

                  {/* Icon */}
                  <div className="text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)] transform group-hover:scale-105 transition-transform">
                    {renderCardIcon(card.iconName, "w-5 h-5 md:w-7 md:h-7")}
                  </div>

                  {/* Lock Overlay during Boss Turn or Skill Cast */}
                  {(!isPlayerTurn || isCastingSkill) && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
                      {isCastingSkill ? (
                        <Sparkles className="w-4 h-4 text-cyan-300 animate-spin" />
                      ) : (
                        <Hourglass className="w-4 h-4 text-slate-400 animate-spin" />
                      )}
                    </div>
                  )}
                </div>

                {/* Card Title */}
                <div className="mt-0.5 flex items-center justify-between">
                  <span className="font-cinzel text-[8.5px] md:text-[9.5px] font-bold text-slate-100 truncate uppercase">
                    {card.name}
                  </span>
                </div>

                {/* Description */}
                <p className="text-[7.5px] md:text-[8px] text-slate-300 leading-tight mt-0.5 line-clamp-2">
                  {card.description}
                </p>

                {/* Stat Tag at bottom */}
                <div className="mt-auto pt-0.5 flex items-center justify-between text-[6.5px] md:text-[7.5px] text-slate-400 font-mono">
                  <span>{card.type.toUpperCase()}</span>
                  <span className="text-cyan-300 font-bold">[{idx + 1}]</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* TURN CONTROLLER BUTTON (AUTOMATIC TRANSITION NOTIFICATION & OPTIONAL PASS) */}
        <div className="shrink-0 flex flex-col items-center ml-0.5 mb-1">
          <button
            onClick={onEndTurn}
            disabled={!isPlayerTurn}
            className={`relative flex flex-col items-center justify-center px-2.5 sm:px-3 py-1.5 h-26 sm:h-28 md:h-30 rounded-lg border-2 transition-all duration-200 shadow-xl ${
              isCastingSkill
                ? 'border-cyan-400 bg-gradient-to-b from-cyan-950 via-slate-900 to-black text-cyan-200 animate-pulse cursor-wait'
                : isPlayerTurn
                ? outOfMana
                  ? 'border-amber-400 bg-gradient-to-b from-amber-900 via-amber-950 to-black text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.5)] cursor-pointer hover:scale-102 active:scale-95'
                  : 'border-slate-600 bg-gradient-to-b from-zinc-900 via-zinc-950 to-black text-slate-300 hover:border-cyan-400 hover:text-white cursor-pointer active:scale-95'
                : 'border-red-950/70 bg-gradient-to-b from-zinc-950 to-black text-slate-500 opacity-60 cursor-not-allowed'
            }`}
          >
            {isCastingSkill ? (
              <>
                <Sparkles className="w-4 h-4 mb-0.5 text-cyan-300 animate-spin" />
                <span className="font-cinzel text-[10px] sm:text-xs font-black uppercase tracking-wider text-center text-cyan-200 leading-tight">
                  Lançando<br />Skill...
                </span>
                <span className="mt-0.5 text-[7px] text-cyan-400 font-mono">
                  Auto Turno
                </span>
              </>
            ) : isPlayerTurn ? (
              <>
                <ChevronRight className="w-4 h-4 mb-0.5 text-slate-300" />
                <span className="font-cinzel text-[10px] sm:text-xs font-bold uppercase tracking-wider text-center leading-tight">
                  Passar<br />Vez
                </span>
                <span className="mt-0.5 text-[7.5px] font-mono px-1 py-0.5 rounded bg-black/60 border border-slate-700 text-amber-300 font-bold">
                  [ESPAÇO]
                </span>
                <span className="text-[6.5px] text-cyan-300/80 mt-0.5 text-center leading-none">
                  (Auto ao usar skill)
                </span>
              </>
            ) : (
              <>
                <Hourglass className="w-4 h-4 mb-0.5 text-red-400 animate-spin" />
                <span className="font-cinzel text-[10px] sm:text-xs font-black uppercase tracking-wider text-center leading-tight text-red-400">
                  Turno do<br />Boss...
                </span>
                <span className="mt-0.5 text-[7px] text-red-300 font-mono">
                  Aguarde
                </span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
