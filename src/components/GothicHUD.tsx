import React, { useRef } from 'react';
import { PlayerStats, BossStats, TurnPhase } from '../types/game';
import { Volume2, VolumeX, BookOpen, Layers, Sparkles, Shield, HeartPulse, Award, Image as ImageIcon, Flame, Zap, Droplets, Sword, Home } from 'lucide-react';
import playerPortraitImg from '../assets/images/hero_mage_portrait_1792039214361.jpg';
import bossSpriteImg from '../assets/images/boss_lorde_sombras_1792034816590.jpg';

interface GothicHUDProps {
  player: PlayerStats;
  boss: BossStats;
  currentTurn: TurnPhase;
  turnNumber: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenLore: () => void;
  onOpenDeck: () => void;
  onTogglePause: () => void;
  isPaused: boolean;
  onUploadBg?: (file: File) => void;
  onSwitchBoss?: () => void;
  onBackToMenu?: () => void;
}

const renderIntentIcon = (iconName: string) => {
  switch (iconName) {
    case 'Flame':
      return <Flame className="w-3.5 h-3.5 text-amber-400" />;
    case 'Shield':
      return <Shield className="w-3.5 h-3.5 text-sky-400" />;
    case 'Zap':
      return <Zap className="w-3.5 h-3.5 text-yellow-400" />;
    case 'Droplets':
      return <Droplets className="w-3.5 h-3.5 text-purple-400" />;
    case 'Sword':
      return <Sword className="w-3.5 h-3.5 text-rose-400" />;
    default:
      return <Flame className="w-3.5 h-3.5 text-amber-400" />;
  }
};

export const GothicHUD: React.FC<GothicHUDProps> = ({
  player,
  boss,
  currentTurn,
  turnNumber,
  isMuted,
  onToggleMute,
  onOpenLore,
  onOpenDeck,
  onTogglePause,
  isPaused,
  onUploadBg,
  onSwitchBoss,
  onBackToMenu
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const playerHpPct = Math.max(0, Math.min(100, (player.hp / player.maxHp) * 100));
  const playerMpPct = Math.max(0, Math.min(100, (player.mp / player.maxMp) * 100));
  const bossHpPct = Math.max(0, Math.min(100, (boss.hp / boss.maxHp) * 100));
  const isPlayerTurn = currentTurn === 'player';

  return (
    <div className="absolute top-0 left-0 right-0 z-30 p-2 md:p-4 pointer-events-none flex flex-col md:flex-row items-start justify-between gap-3">
      {/* LEFT: Player Status Frame (Julioscaesar) */}
      <div className="flex items-center gap-3 bg-black/75 backdrop-blur-md p-2.5 rounded-lg border border-red-950/60 shadow-2xl pointer-events-auto">
        {/* Portrait */}
        <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-md overflow-hidden border-2 border-slate-600 shadow-[0_0_15px_rgba(30,58,138,0.5)] shrink-0 bg-slate-950">
          <img
            src={playerPortraitImg}
            alt="Julioscaesar"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-top scale-110"
          />
          <div className="absolute inset-0 border border-slate-400/30 pointer-events-none" />
          <div className="absolute bottom-0 inset-x-0 bg-slate-950/90 text-center py-0.5 border-t border-slate-800">
            <span className="text-[9px] font-bold text-amber-300 font-mono-numbers">Lv. {player.level}</span>
          </div>
        </div>

        {/* Stats Bars & Buffs */}
        <div className="flex flex-col gap-1.5 min-w-[170px] md:min-w-[220px]">
          {/* Name & Shield Badge */}
          <div className="flex items-center justify-between">
            <span className="font-cinzel text-xs md:text-sm font-bold tracking-wider text-slate-100 uppercase text-glow-blue">
              {player.name}
            </span>
            {player.defense > 0 && (
              <span className="flex items-center gap-1 text-[9px] font-bold text-sky-300 bg-sky-950/90 border border-sky-500/80 px-1.5 py-0.2 rounded shadow">
                <Shield className="w-2.5 h-2.5" /> +{player.defense} Def
              </span>
            )}
          </div>

          {/* HP Bar */}
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-black text-red-400 font-mono w-4">HP</span>
            <div className="relative flex-1 h-3.5 bg-zinc-950 rounded-sm border border-red-900/60 overflow-hidden shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-red-800 via-red-600 to-rose-500 transition-all duration-300 ease-out"
                style={{ width: `${playerHpPct}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-white font-mono-numbers drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                {Math.round(player.hp)} / {player.maxHp}
              </div>
            </div>
          </div>

          {/* MP Bar */}
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-black text-cyan-400 font-mono w-4">MP</span>
            <div className="relative flex-1 h-3 bg-zinc-950 rounded-sm border border-blue-900/60 overflow-hidden shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-blue-800 via-blue-600 to-cyan-400 transition-all duration-300 ease-out"
                style={{ width: `${playerMpPct}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-white font-mono-numbers drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                {Math.round(player.mp)} / {player.maxMp}
              </div>
            </div>
          </div>

          {/* Buff Icons */}
          <div className="flex items-center gap-1.5 pt-0.5">
            <div className="flex items-center justify-center w-4 h-4 rounded bg-blue-950/80 border border-blue-600/70 text-blue-300 shadow-sm" title="Poder Arcano +15%">
              <Sparkles className="w-2.5 h-2.5" />
            </div>
            <div className={`flex items-center justify-center w-4 h-4 rounded ${player.defense > 0 ? 'bg-amber-950/80 border-amber-500 text-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 'bg-zinc-900/80 border-zinc-700 text-zinc-500'} border shadow-sm`} title={`Escudo Rúnico: ${player.defense} defesa`}>
              <Shield className="w-2.5 h-2.5" />
            </div>
            <div className="flex items-center justify-center w-4 h-4 rounded bg-emerald-950/80 border border-emerald-600/70 text-emerald-300 shadow-sm" title="Regeneração Ativa">
              <HeartPulse className="w-2.5 h-2.5" />
            </div>
            <div className="flex items-center justify-center w-4 h-4 rounded bg-purple-950/80 border border-purple-600/70 text-purple-300 shadow-sm" title="Combate Por Turno Tático">
              <Award className="w-2.5 h-2.5" />
            </div>
          </div>
        </div>
      </div>

      {/* TOP CENTER: Turn Indicator & Quick Menu */}
      <div className="flex flex-col items-center gap-1.5 pointer-events-auto self-center">
        {/* Turn Pill Banner */}
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full border shadow-lg backdrop-blur-md transition-all ${
          isPlayerTurn
            ? 'bg-slate-950/90 border-cyan-500/80 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
            : 'bg-red-950/90 border-red-600/80 text-rose-300 shadow-[0_0_15px_rgba(239,68,68,0.4)] animate-pulse'
        }`}>
          <div className={`w-2 h-2 rounded-full ${isPlayerTurn ? 'bg-cyan-400 animate-ping' : 'bg-red-400'}`} />
          <span className="font-cinzel text-xs font-bold uppercase tracking-wider">
            {isPlayerTurn ? `Turno ${turnNumber}: Seu Turno` : `Turno ${turnNumber}: Vez do Boss`}
          </span>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-1.5 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-zinc-800 shadow-xl">
          {onBackToMenu && (
            <>
              <button
                onClick={onBackToMenu}
                className="flex items-center gap-1 text-[11px] text-red-400 hover:text-red-300 transition-colors px-1.5 py-0.5 rounded hover:bg-zinc-800/60 font-cinzel font-bold"
                title="Voltar à Tela Inicial / Menu Principal"
              >
                <Home className="w-3 h-3 text-red-500" />
                <span className="hidden sm:inline">Menu</span>
              </button>
              <div className="w-px h-3 bg-zinc-700" />
            </>
          )}
          <button
            onClick={onOpenLore}
            className="flex items-center gap-1 text-[11px] text-amber-300/90 hover:text-amber-200 transition-colors px-1.5 py-0.5 rounded hover:bg-zinc-800/60"
            title="Ver Atributos & Habilidades do Boss"
          >
            <BookOpen className="w-3 h-3" />
            <span className="font-cinzel hidden sm:inline">Boss Lore</span>
          </button>
          <div className="w-px h-3 bg-zinc-700" />
          <button
            onClick={onOpenDeck}
            className="flex items-center gap-1 text-[11px] text-slate-300 hover:text-white transition-colors px-1.5 py-0.5 rounded hover:bg-zinc-800/60"
            title="Inspecionar Habilidades"
          >
            <Layers className="w-3 h-3" />
            <span className="font-cinzel hidden sm:inline">Deck</span>
          </button>
          <div className="w-px h-3 bg-zinc-700" />
          {onSwitchBoss && (
            <>
              <button
                onClick={onSwitchBoss}
                className="flex items-center gap-1 text-[11px] text-rose-400 hover:text-rose-200 transition-colors px-1.5 py-0.5 rounded hover:bg-zinc-800/60 font-bold"
                title="Alternar entre Boss 1 e Boss 2"
              >
                <Award className="w-3 h-3" />
                <span className="font-cinzel">Boss {boss.id}</span>
              </button>
              <div className="w-px h-3 bg-zinc-700" />
            </>
          )}
          {onUploadBg && (
            <>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1 text-[11px] text-slate-300 hover:text-white transition-colors px-1.5 py-0.5 rounded hover:bg-zinc-800/60"
                title="Trocar Cenário"
              >
                <ImageIcon className="w-3 h-3" />
                <span className="font-cinzel hidden lg:inline">Fundo</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    onUploadBg(file);
                  }
                }}
              />
              <div className="w-px h-3 bg-zinc-700" />
            </>
          )}
          <button
            onClick={onToggleMute}
            className="p-1 text-slate-400 hover:text-slate-100 transition-colors rounded hover:bg-zinc-800/60"
            title={isMuted ? 'Ativar Áudio' : 'Mutar Áudio'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
          </button>
          <div className="w-px h-3 bg-zinc-700" />
          <button
            onClick={onTogglePause}
            className="px-1.5 py-0.5 text-[10px] font-semibold text-slate-300 hover:text-white transition-colors"
          >
            {isPaused ? 'CONTINUAR' : 'PAUSAR'}
          </button>
        </div>
      </div>

      {/* RIGHT: Boss Frame with Intent Telegraph */}
      <div className="flex items-center gap-3 bg-black/75 backdrop-blur-md p-2.5 rounded-lg border border-red-900/60 shadow-2xl pointer-events-auto w-full md:w-auto">
        {/* Boss Icon */}
        <div className="relative w-12 h-12 md:w-14 md:h-14 rounded overflow-hidden border border-red-600/80 shadow-[0_0_12px_rgba(220,38,38,0.7)] shrink-0 bg-red-950">
          <img
            src={bossSpriteImg}
            alt={boss.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-top scale-125"
          />
          {boss.phase === 2 && (
            <div className="absolute inset-0 bg-red-600/20 mix-blend-color-dodge animate-pulse" />
          )}
        </div>

        {/* Boss Bar & Intent */}
        <div className="flex flex-col gap-1 min-w-[190px] md:min-w-[260px] flex-1">
          <div className="flex items-center justify-between">
            <span className="font-cinzel text-xs md:text-sm font-bold tracking-widest text-red-400 text-glow-red uppercase truncate">
              {boss.name}
            </span>
            <span className="text-[9px] font-semibold tracking-wider text-rose-300/80 uppercase">
              {boss.id === 2 ? '2º BOSS' : '1º BOSS'} {boss.phase === 2 ? '(FÚRIA)' : ''}
            </span>
          </div>

          {/* Boss HP Bar */}
          <div className="relative h-4 bg-zinc-950 rounded-sm border border-red-950 overflow-hidden shadow-[0_0_15px_rgba(185,28,28,0.4)]">
            <div
              className={`h-full transition-all duration-300 ease-out ${
                boss.phase === 2
                  ? 'bg-gradient-to-r from-red-950 via-rose-600 to-amber-500 animate-pulse'
                  : 'bg-gradient-to-r from-red-950 via-red-700 to-red-500'
              }`}
              style={{ width: `${bossHpPct}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-rose-100 font-mono-numbers drop-shadow-[0_1px_3px_rgba(0,0,0,1)]">
              {Math.max(0, Math.round(boss.hp))} / {boss.maxHp}
            </div>
          </div>

          {/* Boss Telegraphed Intent (Slay-the-Spire Style Tactical Pill) */}
          {boss.intent && (
            <div className="flex items-center justify-between px-2 py-0.5 rounded bg-red-950/60 border border-red-800/50 mt-0.5">
              <span className="text-[9px] font-mono text-slate-300 flex items-center gap-1 truncate">
                {renderIntentIcon(boss.intent.icon)}
                <span className="font-bold text-rose-300">{boss.intent.name}</span>
              </span>
              <span className="text-[9px] font-mono-numbers font-black text-amber-300 shrink-0 ml-1">
                {boss.intent.type === 'defense' ? `+${boss.intent.value} Def` : `${boss.intent.value} Dano`}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
