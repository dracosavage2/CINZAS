import React, { useState, useEffect, useRef } from 'react';
import { Play, Sparkles, HelpCircle, BookOpen, Layers, Volume2, VolumeX, Shield, Flame, Zap, Droplets, Sword, Image as ImageIcon, Award, ChevronRight, Skull } from 'lucide-react';
import { sounds } from '../utils/audio';
import { Card } from '../types/game';
import { INITIAL_HAND_CARDS, UNLOCKABLE_CARDS } from '../data/cards';

// Assets
import bloodMoonBg from '../assets/images/bg_bloodmoon_castle_1792034815455.jpg';
import bossTitleImg from '../assets/images/boss_lorde_sombras_1792034816590.jpg';
import heroPortraitImg from '../assets/images/hero_mage_portrait_1792039214361.jpg';
import heroCastImg from '../assets/images/hero_cast_skill_1792040353189.jpg';
import bossCastImg from '../assets/images/boss_skill_cast_1792040355196.jpg';

interface FrontTitleScreenProps {
  onStartMatch: (bossId: 1 | 2) => void;
  onOpenGuide: () => void;
  onOpenDeck: () => void;
  onOpenLore: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  customBgUrl: string | null;
  onUploadBg: (file: File) => void;
  onResetBg: () => void;
}

export const FrontTitleScreen: React.FC<FrontTitleScreenProps> = ({
  onStartMatch,
  onOpenGuide,
  onOpenDeck,
  onOpenLore,
  isMuted,
  onToggleMute,
  customBgUrl,
  onUploadBg,
  onResetBg
}) => {
  const [selectedBossId, setSelectedBossId] = useState<1 | 2>(1);
  const [activeTab, setActiveTab] = useState<'arena' | 'cards' | 'bosses' | 'rules'>('arena');
  const [selectedPreviewCard, setSelectedPreviewCard] = useState<Card | null>(INITIAL_HAND_CARDS[0]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Floating embers animation on background canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      color: string;
    }> = [];

    for (let i = 0; i < 45; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: -(Math.random() * 1.2 + 0.3),
        size: Math.random() * 2.5 + 1,
        alpha: Math.random() * 0.7 + 0.3,
        color: Math.random() > 0.4 ? 'rgba(239, 68, 68, ' : 'rgba(245, 158, 11, '
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.002;

        if (p.y < 0 || p.alpha <= 0) {
          p.x = Math.random() * width;
          p.y = height + 10;
          p.alpha = Math.random() * 0.7 + 0.3;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ef4444';
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  const handlePlayBoss = (id: 1 | 2) => {
    sounds.playSwordSlash();
    onStartMatch(id);
  };

  const allCards = [...INITIAL_HAND_CARDS, ...UNLOCKABLE_CARDS];

  return (
    <div className="relative w-full min-h-screen bg-black text-slate-100 flex flex-col justify-between overflow-x-hidden select-none">
      {/* Background with Blood Moon Castle + Vignette */}
      <div className="absolute inset-0 z-0">
        <img
          src={customBgUrl || bloodMoonBg}
          alt="Castelo da Lua de Sangue"
          className="w-full h-full object-cover object-center filter brightness-[0.45] contrast-125 scale-105 transition-all duration-1000"
        />
        {/* Deep Gothic Vignette & Atmospheric Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-zinc-950/80 to-black/80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/50 to-black/95" />
      </div>

      {/* Floating Embers Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-1 pointer-events-none opacity-80" />

      {/* TOP BAR / NAVIGATION */}
      <header className="relative z-10 w-full px-4 md:px-8 py-3.5 flex items-center justify-between border-b border-red-950/70 bg-black/60 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded border border-red-600/80 bg-red-950/90 flex items-center justify-center shadow-[0_0_15px_rgba(220,38,38,0.6)]">
            <Skull className="w-5 h-5 text-red-500 animate-pulse" />
          </div>
          <div>
            <span className="font-cinzel text-sm sm:text-base font-black tracking-widest text-red-500 text-glow-red uppercase block">
              Lorde das Sombras
            </span>
            <span className="text-[10px] font-mono text-slate-400 tracking-wider uppercase block">
              Duelo Tático de Cartas • Por Turnos
            </span>
          </div>
        </div>

        {/* Action Pills */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs">
          <button
            onClick={() => {
              sounds.playMagicShield();
              onOpenGuide();
            }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded border border-zinc-800 bg-zinc-900/90 hover:bg-zinc-800 text-slate-300 font-cinzel text-[11px] uppercase transition-all shadow"
          >
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
            Guia do Combate
          </button>

          <button
            onClick={() => {
              sounds.playEnergyBall();
              onOpenDeck();
            }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded border border-zinc-800 bg-zinc-900/90 hover:bg-zinc-800 text-slate-300 font-cinzel text-[11px] uppercase transition-all shadow"
          >
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            Grimório (8 Cartas)
          </button>

          <button
            onClick={() => {
              sounds.playCurseCast();
              onOpenLore();
            }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded border border-zinc-800 bg-zinc-900/90 hover:bg-zinc-800 text-slate-300 font-cinzel text-[11px] uppercase transition-all shadow"
          >
            <BookOpen className="w-3.5 h-3.5 text-purple-400" />
            Lore dos Bosses
          </button>

          {/* Sound Mute */}
          <button
            onClick={onToggleMute}
            className="p-2 rounded border border-zinc-800 bg-zinc-900/90 hover:bg-zinc-800 text-slate-300 transition-colors shadow"
            title={isMuted ? 'Ativar Efeitos Sonoros' : 'Mutar Áudio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>
      </header>

      {/* MAIN HERO VS BOSS SHOWCASE */}
      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-6 flex flex-col justify-center">
        {/* Navigation Tabs on Front */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <button
            onClick={() => setActiveTab('arena')}
            className={`px-4 py-1.5 rounded-full text-xs font-cinzel font-bold tracking-wider uppercase transition-all ${
              activeTab === 'arena'
                ? 'bg-red-950 border border-red-600 text-red-200 shadow-[0_0_15px_rgba(220,38,38,0.5)]'
                : 'bg-zinc-950/70 border border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            Arena de Batalha
          </button>
          <button
            onClick={() => setActiveTab('cards')}
            className={`px-4 py-1.5 rounded-full text-xs font-cinzel font-bold tracking-wider uppercase transition-all ${
              activeTab === 'cards'
                ? 'bg-cyan-950 border border-cyan-600 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.5)]'
                : 'bg-zinc-950/70 border border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            Grimório & Habilidades
          </button>
          <button
            onClick={() => setActiveTab('bosses')}
            className={`px-4 py-1.5 rounded-full text-xs font-cinzel font-bold tracking-wider uppercase transition-all ${
              activeTab === 'bosses'
                ? 'bg-purple-950 border border-purple-600 text-purple-200 shadow-[0_0_15px_rgba(168,85,247,0.5)]'
                : 'bg-zinc-950/70 border border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            Bestiário dos Bosses
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`px-4 py-1.5 rounded-full text-xs font-cinzel font-bold tracking-wider uppercase transition-all ${
              activeTab === 'rules'
                ? 'bg-amber-950 border border-amber-600 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.5)]'
                : 'bg-zinc-950/70 border border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            Regras & Turnos
          </button>
        </div>

        {/* TAB 1: MAIN ARENA & BOSS SELECTION */}
        {activeTab === 'arena' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* LEFT COLUMN: HERO SPOTLIGHT (JULIOSCAESAR) */}
            <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left bg-zinc-950/85 backdrop-blur-md p-5 rounded-xl border border-slate-800/80 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-2xl pointer-events-none" />

              <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-400 uppercase mb-1">
                Herói Combatente
              </span>
              <h2 className="font-cinzel text-xl sm:text-2xl font-black tracking-wider text-slate-100 uppercase">
                Julioscaesar
              </h2>
              <span className="text-xs text-slate-400 italic font-cinzel mb-4">
                O Sábio das Cartas • Nível 12
              </span>

              {/* Hero Portrait Frame */}
              <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-lg overflow-hidden border-2 border-cyan-500/80 shadow-[0_0_30px_rgba(6,182,212,0.35)] mb-4 bg-slate-950">
                <img
                  src={heroPortraitImg}
                  alt="Julioscaesar - O Sábio das Cartas"
                  className="w-full h-full object-cover object-top scale-105 group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/60 to-transparent p-2 text-center">
                  <span className="text-[10px] font-mono font-black text-cyan-300 uppercase">
                    Mago Arcano • 3 Mana/Turno
                  </span>
                </div>
              </div>

              {/* Hero Stats Card */}
              <div className="w-full grid grid-cols-2 gap-2 text-xs mb-3">
                <div className="bg-zinc-900/90 border border-zinc-800 p-2 rounded">
                  <span className="text-[10px] text-slate-400 block">Pontos de Vida</span>
                  <span className="font-mono-numbers font-black text-red-400 text-sm">420 HP</span>
                </div>
                <div className="bg-zinc-900/90 border border-zinc-800 p-2 rounded">
                  <span className="text-[10px] text-slate-400 block">Mana Inicial</span>
                  <span className="font-mono-numbers font-black text-cyan-300 text-sm">3 / 3 Cristais</span>
                </div>
              </div>

              {/* Passive Feature Pill */}
              <div className="w-full bg-blue-950/40 border border-blue-900/60 p-2.5 rounded text-left flex items-start gap-2 text-[11px] text-slate-300">
                <Shield className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-cyan-300 block">Passiva: Evasão & Barreira</strong>
                  Teleporte espacial esquiva do golpe do Boss. Cartas ativam instantaneamente.
                </span>
              </div>
            </div>

            {/* CENTER COLUMN: TITLE, BADGES & CALL TO ACTION */}
            <div className="lg:col-span-4 flex flex-col items-center text-center px-2">
              <span className="text-xs font-mono font-black tracking-widest text-red-500 uppercase flex items-center gap-1.5 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Dark Fantasy Souls Combat
              </span>

              <h1 className="font-cinzel text-3xl sm:text-5xl font-black tracking-wider text-red-600 text-glow-red uppercase leading-tight drop-shadow-[0_5px_15px_rgba(185,28,28,0.7)]">
                Lorde das Sombras
              </h1>

              <div className="w-40 h-0.5 bg-gradient-to-r from-transparent via-red-600 to-transparent my-3" />

              <p className="text-xs sm:text-sm text-slate-300 max-w-sm mb-5 leading-relaxed">
                Duelo épico na ponte gótica sob a lua de sangue. Lance suas cartas arcanas como habilidades com custo de mana.
                <span className="text-rose-400 font-bold block mt-1">
                  ⚡ O turno avança automaticamente ao soltar sua skill!
                </span>
              </p>

              {/* Boss Selector Tabs */}
              <div className="w-full max-w-xs flex items-center p-1 rounded-lg bg-zinc-950/90 border border-red-950 mb-4 shadow-inner">
                <button
                  onClick={() => {
                    sounds.playShieldHit();
                    setSelectedBossId(1);
                  }}
                  className={`flex-1 py-2 px-3 rounded text-[11px] font-cinzel font-bold tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                    selectedBossId === 1
                      ? 'bg-red-900 border border-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)]'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Skull className="w-3.5 h-3.5 text-rose-300" />
                  1º Boss (420 HP)
                </button>
                <button
                  onClick={() => {
                    sounds.playCurseCast();
                    setSelectedBossId(2);
                  }}
                  className={`flex-1 py-2 px-3 rounded text-[11px] font-cinzel font-bold tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                    selectedBossId === 2
                      ? 'bg-purple-900 border border-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Award className="w-3.5 h-3.5 text-purple-300" />
                  2º Boss (550 HP)
                </button>
              </div>

              {/* PRIMARY PLAY BUTTON */}
              <button
                onClick={() => handlePlayBoss(selectedBossId)}
                className="w-full max-w-xs py-4 px-6 rounded-lg border-2 border-red-600 bg-gradient-to-r from-red-950 via-red-900 to-rose-900 hover:from-red-900 hover:to-rose-800 text-white font-cinzel font-black text-sm sm:text-base tracking-widest uppercase transition-all duration-200 hover:scale-105 shadow-[0_0_35px_rgba(220,38,38,0.7)] flex items-center justify-center gap-3 group"
              >
                <Play className="w-5 h-5 fill-white group-hover:animate-pulse" />
                <span>Entrar no Combate</span>
                <ChevronRight className="w-4 h-4 text-red-300 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* CAMPAIGN BUTTON */}
              <button
                onClick={() => handlePlayBoss(1)}
                className="w-full max-w-xs mt-2.5 py-2.5 px-4 rounded border border-amber-800/80 bg-zinc-950/80 hover:bg-zinc-900 text-amber-200 font-cinzel font-bold text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-2"
              >
                <Award className="w-4 h-4 text-amber-400" />
                Modo Campanha (Boss 1 → Boss 2)
              </button>

              {/* Highlights Feature Bar */}
              <div className="grid grid-cols-3 gap-2 mt-4 w-full max-w-xs text-[10px]">
                <div className="bg-zinc-900/80 border border-zinc-800/80 p-1.5 rounded text-center">
                  <span className="text-zinc-400 block">Modo</span>
                  <span className="text-cyan-300 font-bold">Por Turnos</span>
                </div>
                <div className="bg-zinc-900/80 border border-zinc-800/80 p-1.5 rounded text-center">
                  <span className="text-zinc-400 block">Fluxo</span>
                  <span className="text-emerald-300 font-bold">Sem Espera</span>
                </div>
                <div className="bg-zinc-900/80 border border-zinc-800/80 p-1.5 rounded text-center">
                  <span className="text-zinc-400 block">Reações</span>
                  <span className="text-amber-300 font-bold">Em Tempo Real</span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: BOSS SPOTLIGHT */}
            <div className="lg:col-span-4 flex flex-col items-center lg:items-end text-center lg:text-right bg-zinc-950/85 backdrop-blur-md p-5 rounded-xl border border-red-950/80 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-32 h-32 bg-red-600/10 rounded-full blur-2xl pointer-events-none" />

              <span className="text-[10px] font-mono font-bold tracking-widest text-rose-400 uppercase mb-1">
                {selectedBossId === 1 ? '1º Chefe Abissal' : '2º Chefe do Vazio'}
              </span>
              <h2 className="font-cinzel text-xl sm:text-2xl font-black tracking-wider text-red-500 uppercase">
                {selectedBossId === 1 ? 'Lorde das Sombras' : 'Lorde do Vazio'}
              </h2>
              <span className="text-xs text-rose-300/80 italic font-cinzel mb-4">
                {selectedBossId === 1 ? 'Guardião do Abismo de Sangue' : 'O Carrasco Desperto do Eclipse'}
              </span>

              {/* Boss Portrait Frame */}
              <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-lg overflow-hidden border-2 border-red-600/90 shadow-[0_0_30px_rgba(220,38,38,0.45)] mb-4 bg-red-950">
                <img
                  src={selectedBossId === 1 ? bossTitleImg : bossCastImg}
                  alt={selectedBossId === 1 ? 'Lorde das Sombras' : 'Lorde do Vazio'}
                  className="w-full h-full object-cover object-top scale-110 group-hover:scale-125 transition-transform duration-500"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/70 to-transparent p-2 text-center">
                  <span className="text-[10px] font-mono font-black text-rose-300 uppercase">
                    {selectedBossId === 1 ? 'Fase 1 & Fase 2 Fúria' : 'Fase Titânica de Plasma'}
                  </span>
                </div>
              </div>

              {/* Boss Stats */}
              <div className="w-full grid grid-cols-2 gap-2 text-xs mb-3">
                <div className="bg-zinc-900/90 border border-zinc-800 p-2 rounded">
                  <span className="text-[10px] text-slate-400 block">Vida Máxima</span>
                  <span className="font-mono-numbers font-black text-red-400 text-sm">
                    {selectedBossId === 1 ? '420 HP' : '550 HP'}
                  </span>
                </div>
                <div className="bg-zinc-900/90 border border-zinc-800 p-2 rounded">
                  <span className="text-[10px] text-slate-400 block">Nível de Ameaça</span>
                  <span className="font-mono-numbers font-black text-rose-400 text-sm">
                    {selectedBossId === 1 ? 'Ameaça S' : 'Ameaça SS+'}
                  </span>
                </div>
              </div>

              {/* Telegraphed Intention Preview */}
              <div className="w-full bg-red-950/40 border border-red-900/60 p-2.5 rounded text-left flex items-start gap-2 text-[11px] text-slate-300">
                <Flame className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-amber-300 block">
                    {selectedBossId === 1 ? 'Golpe Inicial: Orbe do Caos (35 Dano)' : 'Golpe Inicial: Supernova (55 Dano)'}
                  </strong>
                  Observe o ícone de intenção acima da barra de vida do Boss para antecipar seu ataque ou escudo!
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: GRIMÓRIO & CARDS PREVIEW */}
        {activeTab === 'cards' && (
          <div className="bg-zinc-950/90 backdrop-blur-md p-6 rounded-xl border border-cyan-950 max-w-5xl mx-auto w-full shadow-2xl animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-zinc-800">
              <div>
                <h3 className="font-cinzel text-lg sm:text-xl font-black text-cyan-400 uppercase flex items-center gap-2">
                  <Layers className="w-5 h-5 text-cyan-400" />
                  Grimório das Cartas Arcanas (8 Habilidades)
                </h3>
                <p className="text-xs text-slate-400">
                  Cada habilidade possui um custo de Mana de 1 a 3 cristais. Ao jogar a carta, ela executa a animação e passa a vez ao Boss.
                </p>
              </div>
              <button
                onClick={() => handlePlayBoss(selectedBossId)}
                className="py-2 px-4 rounded bg-cyan-700 hover:bg-cyan-600 text-white font-cinzel font-bold text-xs uppercase transition-colors shrink-0 flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                Testar no Combate
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {allCards.map((card) => {
                const isSelected = selectedPreviewCard?.id === card.id;
                return (
                  <div
                    key={card.id}
                    onClick={() => {
                      sounds.playCardHover();
                      setSelectedPreviewCard(card);
                    }}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-cyan-400 bg-cyan-950/60 shadow-[0_0_20px_rgba(6,182,212,0.4)] scale-102'
                        : 'border-zinc-800 bg-zinc-900/70 hover:border-zinc-600 hover:bg-zinc-800/80'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono font-bold text-cyan-300 bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-800">
                        {card.cost} Mana
                      </span>
                      <span className="text-[9px] uppercase font-bold text-zinc-400">
                        {card.type}
                      </span>
                    </div>

                    <h4 className="font-cinzel text-xs font-black text-slate-100 truncate mb-1">
                      {card.name}
                    </h4>

                    <p className="text-[11px] text-slate-300 line-clamp-2 leading-tight mb-2">
                      {card.description}
                    </p>

                    <div className="pt-1.5 border-t border-zinc-800/80 flex items-center justify-between text-[10px]">
                      {card.damage && <span className="text-rose-400 font-bold">{card.damage} Dano</span>}
                      {card.defense && <span className="text-sky-400 font-bold">+{card.defense} Def</span>}
                      {card.heal && <span className="text-emerald-400 font-bold">+{card.heal} Cura</span>}
                      {card.id === 'teleporte' && <span className="text-purple-300 font-bold">Esquiva 100%</span>}
                    </div>
                  </div>
                );
              })}
            </div>

            {selectedPreviewCard && (
              <div className="mt-4 p-3 rounded-lg bg-zinc-900/90 border border-cyan-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-cyan-400 font-bold font-cinzel uppercase block">
                    {selectedPreviewCard.name} ({selectedPreviewCard.cost} Mana)
                  </span>
                  <span className="text-slate-300 italic">{selectedPreviewCard.flair}</span>
                </div>
                <button
                  onClick={() => handlePlayBoss(selectedBossId)}
                  className="px-4 py-2 rounded bg-gradient-to-r from-red-800 to-rose-700 hover:from-red-700 hover:to-rose-600 text-white font-cinzel font-bold text-xs uppercase shrink-0 transition-transform hover:scale-105"
                >
                  Usar no Duelo
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: BESTIÁRIO DOS BOSSES */}
        {activeTab === 'bosses' && (
          <div className="bg-zinc-950/90 backdrop-blur-md p-6 rounded-xl border border-purple-950 max-w-5xl mx-auto w-full shadow-2xl animate-in fade-in duration-300">
            <h3 className="font-cinzel text-xl font-black text-purple-400 uppercase mb-4 flex items-center gap-2">
              <Skull className="w-5 h-5 text-purple-400" />
              Bestiário de Ébano: Os Dois Senhores da Ruína
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Boss 1 Dossier */}
              <div className="p-4 rounded-lg bg-red-950/30 border border-red-900/60 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={bossTitleImg}
                      alt="Lorde das Sombras"
                      className="w-14 h-14 rounded object-cover border border-red-500 shadow"
                    />
                    <div>
                      <h4 className="font-cinzel font-black text-base text-red-400 uppercase">
                        Lorde das Sombras (Boss 1)
                      </h4>
                      <span className="text-xs text-rose-300/80 font-mono">
                        420 HP • Guardião do Abismo
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed mb-3">
                    Outrora o guardião supremo da ponte real, foi tragado pelo sangue da lua profana. Empunha chamas do caos e ergue escudos de cinzas quando ameaçado.
                  </p>
                  <div className="space-y-1.5 text-xs text-slate-300">
                    <div className="flex items-center justify-between bg-zinc-900/80 p-1.5 rounded">
                      <span className="text-slate-400">Orbe do Caos:</span>
                      <span className="text-rose-400 font-bold">35 Dano</span>
                    </div>
                    <div className="flex items-center justify-between bg-zinc-900/80 p-1.5 rounded">
                      <span className="text-slate-400">Barreira Sombria:</span>
                      <span className="text-sky-400 font-bold">+50 Escudo</span>
                    </div>
                    <div className="flex items-center justify-between bg-zinc-900/80 p-1.5 rounded">
                      <span className="text-slate-400">Chuva de Meteoros:</span>
                      <span className="text-yellow-400 font-bold">45 Dano</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handlePlayBoss(1)}
                  className="mt-4 w-full py-2.5 rounded bg-red-900 hover:bg-red-800 text-white font-cinzel font-bold text-xs uppercase tracking-wider transition-colors shadow"
                >
                  Desafiar Lorde das Sombras
                </button>
              </div>

              {/* Boss 2 Dossier */}
              <div className="p-4 rounded-lg bg-purple-950/30 border border-purple-900/60 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={bossCastImg}
                      alt="Lorde do Vazio"
                      className="w-14 h-14 rounded object-cover border border-purple-500 shadow"
                    />
                    <div>
                      <h4 className="font-cinzel font-black text-base text-purple-400 uppercase">
                        Lorde do Vazio (Boss 2)
                      </h4>
                      <span className="text-xs text-purple-300/80 font-mono">
                        550 HP • O Carrasco Desperto
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed mb-3">
                    Uma anomalia dimensional nascida do colapso da fenda estelar. Capaz de invocar supernovas de plasma roxo e drenar a essência de quem ousar desafiá-lo.
                  </p>
                  <div className="space-y-1.5 text-xs text-slate-300">
                    <div className="flex items-center justify-between bg-zinc-900/80 p-1.5 rounded">
                      <span className="text-slate-400">Supernova do Vazio:</span>
                      <span className="text-rose-400 font-bold">55 Dano</span>
                    </div>
                    <div className="flex items-center justify-between bg-zinc-900/80 p-1.5 rounded">
                      <span className="text-slate-400">Muralha Abissal:</span>
                      <span className="text-sky-400 font-bold">+75 Escudo</span>
                    </div>
                    <div className="flex items-center justify-between bg-zinc-900/80 p-1.5 rounded">
                      <span className="text-slate-400">Julgamento Carmesim:</span>
                      <span className="text-purple-400 font-bold">70 Dano</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handlePlayBoss(2)}
                  className="mt-4 w-full py-2.5 rounded bg-purple-900 hover:bg-purple-800 text-white font-cinzel font-bold text-xs uppercase tracking-wider transition-colors shadow"
                >
                  Desafiar Lorde do Vazio
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: REGRAS DO COMBATE POR TURNOS */}
        {activeTab === 'rules' && (
          <div className="bg-zinc-950/90 backdrop-blur-md p-6 rounded-xl border border-amber-950 max-w-4xl mx-auto w-full shadow-2xl animate-in fade-in duration-300">
            <h3 className="font-cinzel text-xl font-black text-amber-400 uppercase mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              Regras do Combate 100% Por Turnos
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs mb-5">
              <div className="p-3.5 rounded bg-zinc-900 border border-zinc-800">
                <span className="w-6 h-6 rounded-full bg-cyan-950 border border-cyan-500 text-cyan-300 font-bold flex items-center justify-center mb-2">
                  1
                </span>
                <h4 className="font-cinzel font-bold text-slate-100 uppercase mb-1">
                  Seu Turno: Cartas & Mana
                </h4>
                <p className="text-slate-300 leading-relaxed">
                  Você inicia com 3 cristais de Mana. Clique ou aperte a tecla de atalho [1 a 5] para invocar sua carta de ataque, escudo ou esquiva.
                </p>
              </div>

              <div className="p-3.5 rounded bg-zinc-900 border border-zinc-800">
                <span className="w-6 h-6 rounded-full bg-emerald-950 border border-emerald-500 text-emerald-300 font-bold flex items-center justify-center mb-2">
                  2
                </span>
                <h4 className="font-cinzel font-bold text-slate-100 uppercase mb-1">
                  Passagem Automática
                </h4>
                <p className="text-slate-300 leading-relaxed">
                  Não é necessário clicar em "Finalizar Turno". Assim que você dispara a primeira habilidade, o jogo executa o golpe e passa automaticamente a vez para o Boss.
                </p>
              </div>

              <div className="p-3.5 rounded bg-zinc-900 border border-zinc-800">
                <span className="w-6 h-6 rounded-full bg-rose-950 border border-rose-500 text-rose-300 font-bold flex items-center justify-center mb-2">
                  3
                </span>
                <h4 className="font-cinzel font-bold text-slate-100 uppercase mb-1">
                  Reação do Boss & Retorno
                </h4>
                <p className="text-slate-300 leading-relaxed">
                  O Boss reage em tempo real com sua intenção telegrafada. Quando o ataque conclui, o turno retorna para você com 3 cristais de Mana restaurados!
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <button
                onClick={() => handlePlayBoss(selectedBossId)}
                className="py-3 px-8 rounded-lg bg-gradient-to-r from-red-800 via-rose-700 to-amber-700 hover:from-red-700 hover:to-amber-600 text-white font-cinzel font-black text-sm uppercase tracking-widest transition-transform hover:scale-105 shadow-[0_0_25px_rgba(220,38,38,0.6)]"
              >
                Entendido, Começar Combate!
              </button>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER BAR WITH CUSTOM BACKGROUND CONTROLS */}
      <footer className="relative z-10 w-full px-4 md:px-8 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-red-950/70 bg-black/70 backdrop-blur-md text-xs">
        <div className="flex items-center gap-2 text-slate-400 text-[11px]">
          <span>Arena Gótica Dark Souls</span>
          <span>•</span>
          <span className="text-amber-400 font-mono">v2.5 Por Turnos Automático</span>
        </div>

        {/* Custom Background File Picker */}
        <div className="flex items-center gap-2">
          <label className="py-1.5 px-3 rounded border border-zinc-800 bg-zinc-900/90 hover:bg-zinc-800 text-slate-300 font-cinzel text-[11px] uppercase transition-colors flex items-center gap-1.5 cursor-pointer shadow">
            <ImageIcon className="w-3.5 h-3.5 text-rose-400" />
            {customBgUrl ? 'Trocar Fundo (Personalizado Ativo)' : 'Personalizar Fundo do Jogo'}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onUploadBg(file);
              }}
            />
          </label>

          {customBgUrl && (
            <button
              onClick={onResetBg}
              className="py-1.5 px-2.5 rounded border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white text-[11px] font-mono transition-colors"
              title="Restaurar imagem padrão"
            >
              Restaurar
            </button>
          )}
        </div>
      </footer>
    </div>
  );
};
