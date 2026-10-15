import React, { useState, useEffect, useCallback } from 'react';
import { PlayerStats, BossStats, Card, GameStatus, TurnPhase, BossIntent } from './types/game';
import { INITIAL_HAND_CARDS } from './data/cards';
import { GothicHUD } from './components/GothicHUD';
import { CardHandBar } from './components/CardHandBar';
import { GameCanvas } from './components/GameCanvas';
import { BossLoreModal } from './components/BossLoreModal';
import { DeckModal } from './components/DeckModal';
import { ControlsGuideModal } from './components/ControlsGuideModal';
import { VictoryDefeatOverlay } from './components/VictoryDefeatOverlay';
import { FrontTitleScreen } from './components/FrontTitleScreen';
import { sounds } from './utils/audio';
import { Play, HelpCircle, Image as ImageIcon, Award } from 'lucide-react';

import bossTitleImg from './assets/images/boss_lorde_sombras_1792034816590.jpg';

// Boss Database (Boss 1 and Boss 2)
const BOSS_CONFIGS: Record<1 | 2, { name: string; title: string; maxHp: number; intents: BossIntent[] }> = {
  1: {
    name: 'LORDE DAS SOMBRAS',
    title: 'Guardião do Abismo (1º Boss)',
    maxHp: 420,
    intents: [
      { name: 'Orbe do Caos', type: 'attack', value: 35, icon: 'Flame', description: 'Lança crânio flamejante contra o herói' },
      { name: 'Barreira Sombria', type: 'defense', value: 50, icon: 'Shield', description: 'Ergue barreira impenetrável (+50 escudo)' },
      { name: 'Chuva do Caos', type: 'attack', value: 45, icon: 'Zap', description: 'Bombardeio aéreo com meteoros de fogo negro' },
      { name: 'Toque Espectral', type: 'special', value: 40, icon: 'Droplets', description: 'Onda sombria perfurante' }
    ]
  },
  2: {
    name: 'LORDE DO VAZIO',
    title: 'O Carrasco Desperto (2º Boss)',
    maxHp: 550,
    intents: [
      { name: 'Supernova do Vazio', type: 'attack', value: 55, icon: 'Flame', description: 'Ataque devastador de plasma cósmico' },
      { name: 'Muralha Abissal', type: 'defense', value: 75, icon: 'Shield', description: 'Barreira espessa de ébano (+75 escudo)' },
      { name: 'Drenagem Sanguínea', type: 'special', value: 50, icon: 'Droplets', description: 'Drena a essência vital do mago' },
      { name: 'Julgamento Carmesim', type: 'attack', value: 70, icon: 'Sword', description: 'Golpe fulminante de pura aniquilação' }
    ]
  }
};

const getRandomIntent = (bossId: 1 | 2, phase: 1 | 2): BossIntent => {
  const config = BOSS_CONFIGS[bossId];
  const list = config.intents;
  const chosen = list[Math.floor(Math.random() * list.length)];
  // Phase 2 boosts intent value
  const bonus = phase === 2 ? 10 : 0;
  return {
    ...chosen,
    value: chosen.value + bonus
  };
};

export default function App() {
  const [gameStatus, setGameStatus] = useState<GameStatus>('TITLE');
  const [isMuted, setIsMuted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Turn-Based State
  const [currentTurn, setCurrentTurn] = useState<TurnPhase>('player');
  const [turnNumber, setTurnNumber] = useState<number>(1);
  const [triggerBossToken, setTriggerBossToken] = useState<number>(0);

  // Active Boss Selection (1 or 2)
  const [currentBossId, setCurrentBossId] = useState<1 | 2>(1);

  // Custom stage background
  const [customBgUrl, setCustomBgUrl] = useState<string | null>(() => {
    return localStorage.getItem('souls_custom_bg') || null;
  });

  const handleUploadBg = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const res = e.target?.result as string;
      if (res) {
        setCustomBgUrl(res);
        try {
          localStorage.setItem('souls_custom_bg', res);
        } catch {
          // quota
        }
      }
    };
    reader.readAsDataURL(file);
  };

  // Modals state
  const [loreOpen, setLoreOpen] = useState(false);
  const [deckOpen, setDeckOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);

  // Player & Boss Entities State
  const [player, setPlayer] = useState<PlayerStats>({
    name: 'JULIOSCAESAR',
    title: 'Sábio das Cartas',
    level: 12,
    hp: 420,
    maxHp: 420,
    mp: 180,
    maxMp: 180,
    mana: 3,
    maxMana: 3,
    defense: 0,
    defenseTurns: 0,
    isDodging: false,
    dodgeCooldown: 0,
    score: 0
  });

  const [boss, setBoss] = useState<BossStats>(() => {
    const cfg = BOSS_CONFIGS[1];
    return {
      id: 1,
      name: cfg.name,
      title: cfg.title,
      hp: cfg.maxHp,
      maxHp: cfg.maxHp,
      phase: 1,
      state: 'idle',
      actionTimer: 0,
      x: 980,
      y: 400,
      facing: -1,
      isEnraged: false,
      barrier: 0,
      barrierMax: 0,
      intent: cfg.intents[0]
    };
  });

  // Active Hand Cards
  const [handCards, setHandCards] = useState<Card[]>(INITIAL_HAND_CARDS);
  const [selectedCardIdx, setSelectedCardIdx] = useState<number | null>(null);

  // Queued card to execute in Canvas
  const [queuedCard, setQueuedCard] = useState<{ card: Card; time: number } | null>(null);
  const [isCastingSkill, setIsCastingSkill] = useState(false);

  // Initialize or Restart Match
  const startMatch = (bossId: 1 | 2 = 1) => {
    const cfg = BOSS_CONFIGS[bossId];
    setCurrentBossId(bossId);

    setPlayer({
      name: 'JULIOSCAESAR',
      title: 'Sábio das Cartas',
      level: bossId === 2 ? 15 : 12,
      hp: 420,
      maxHp: 420,
      mp: 180,
      maxMp: 180,
      mana: 3,
      maxMana: 3,
      defense: 0,
      defenseTurns: 0,
      isDodging: false,
      dodgeCooldown: 0,
      score: (bossId - 1) * 5000
    });

    setBoss({
      id: bossId,
      name: cfg.name,
      title: cfg.title,
      hp: cfg.maxHp,
      maxHp: cfg.maxHp,
      phase: 1,
      state: 'idle',
      actionTimer: 0,
      x: 980,
      y: 400,
      facing: -1,
      isEnraged: false,
      barrier: 0,
      barrierMax: 0,
      intent: getRandomIntent(bossId, 1)
    });

    setHandCards(INITIAL_HAND_CARDS);
    setQueuedCard(null);
    setIsCastingSkill(false);
    setCurrentTurn('player');
    setTurnNumber(1);
    setTriggerBossToken(0);
    setGameStatus('PLAYING');
    setIsPaused(false);
    sounds.startMusic();
  };

  const handleRestart = () => {
    startMatch(currentBossId);
  };

  const handleStartGame = () => {
    startMatch(1);
  };

  const handleSwitchBoss = () => {
    const nextId: 1 | 2 = currentBossId === 1 ? 2 : 1;
    startMatch(nextId);
  };

  // Card Playing Handler (Turn-Based: spends Mana & executes skill)
  const handlePlayCard = useCallback(
    (card: Card, index: number) => {
      if (gameStatus !== 'PLAYING' || isPaused) return;
      if (currentTurn !== 'player') return;
      if (isCastingSkill) return; // Prevent double casting before skill impact
      if (player.mana < card.cost) return;

      // Lock skill cast during execution
      setIsCastingSkill(true);

      // Deduct Mana
      setPlayer((prev) => ({
        ...prev,
        mana: Math.max(0, prev.mana - card.cost)
      }));

      // Queue for Canvas execution
      setQueuedCard({ card, time: Date.now() });
      setSelectedCardIdx(index);
      setTimeout(() => setSelectedCardIdx(null), 300);
    },
    [gameStatus, isPaused, currentTurn, isCastingSkill, player.mana]
  );

  // Automatic Turn Transition: Called immediately after Player Skill impact resolves
  const handlePlayerSkillFinished = useCallback(() => {
    if (gameStatus !== 'PLAYING' || isPaused) return;

    setBoss((currBoss) => {
      // If boss is defeated, victory was triggered, do not trigger boss turn
      if (currBoss.hp <= 0) return currBoss;

      // Automatically transition to boss turn
      setCurrentTurn('boss');
      setTriggerBossToken((prev) => prev + 1);
      return currBoss;
    });
  }, [gameStatus, isPaused]);

  // Optional manual pass of turn (e.g. Spacebar or Pass button)
  const handleEndTurn = useCallback(() => {
    if (gameStatus !== 'PLAYING' || isPaused) return;
    if (currentTurn !== 'player' || isCastingSkill) return;

    setCurrentTurn('boss');
    setTriggerBossToken((prev) => prev + 1);
  }, [gameStatus, isPaused, currentTurn, isCastingSkill]);

  // Boss Finished Action -> Start New Player Turn
  const handleBossTurnComplete = useCallback(() => {
    setBoss((currBoss) => {
      if (currBoss.hp <= 0) return currBoss;

      setCurrentTurn('player');
      setTurnNumber((prev) => prev + 1);
      setIsCastingSkill(false);

      // Replenish Player Mana to max each turn start
      setPlayer((prev) => ({
        ...prev,
        mana: prev.maxMana
      }));

      // Roll next Boss Intent for the new turn
      return {
        ...currBoss,
        intent: getRandomIntent(currBoss.id, currBoss.phase)
      };
    });
  }, []);

  // Card Hotkeys (1-5) & End Turn Hotkey (Space / Enter)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameStatus !== 'PLAYING' || isPaused) return;

      // End turn with Spacebar or Enter
      if ((e.code === 'Space' || e.key === 'Enter') && currentTurn === 'player') {
        e.preventDefault();
        handleEndTurn();
        return;
      }

      // Play cards with 1..5
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= handCards.length) {
        const cardIndex = num - 1;
        const card = handCards[cardIndex];
        if (card) {
          handlePlayCard(card, cardIndex);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameStatus, isPaused, currentTurn, handCards, handlePlayCard, handleEndTurn]);

  // Audio Toggle
  const toggleMute = () => {
    const nextMuted = sounds.toggleMute();
    setIsMuted(nextMuted);
  };

  // Card Swap in Deck Modal
  const handleSwapCard = (removeIndex: number, newCard: Card) => {
    setHandCards((prev) => {
      const updated = [...prev];
      updated[removeIndex] = { ...newCard };
      return updated;
    });
  };

  // Defeat & Victory triggers
  const onBossDefeated = () => {
    setGameStatus('VICTORY');
    sounds.playVictory();
  };

  const onPlayerDefeated = () => {
    setGameStatus('DEFEAT');
    sounds.playDeathBell();
  };

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden flex flex-col font-sans select-none">
      {/* FRONT / TITLE SCREEN (Tela Front Inicial do Jogo) */}
      {gameStatus === 'TITLE' ? (
        <FrontTitleScreen
          onStartMatch={(bossId) => {
            startMatch(bossId);
            setGameStatus('PLAYING');
          }}
          onOpenGuide={() => setGuideOpen(true)}
          onOpenDeck={() => setDeckOpen(true)}
          onOpenLore={() => setLoreOpen(true)}
          isMuted={isMuted}
          onToggleMute={toggleMute}
          customBgUrl={customBgUrl}
          onUploadBg={handleUploadBg}
          onResetBg={() => {
            setCustomBgUrl(null);
            localStorage.removeItem('souls_custom_bg');
          }}
        />
      ) : (
        <>
          {/* Active Game HUD (Top Bar with Turn and Boss Intent) */}
          <GothicHUD
            player={player}
            boss={boss}
            currentTurn={currentTurn}
            turnNumber={turnNumber}
            isMuted={isMuted}
            onToggleMute={toggleMute}
            onOpenLore={() => setLoreOpen(true)}
            onOpenDeck={() => setDeckOpen(true)}
            onTogglePause={() => setIsPaused(!isPaused)}
            isPaused={isPaused}
            onUploadBg={handleUploadBg}
            onSwitchBoss={handleSwitchBoss}
            onBackToMenu={() => setGameStatus('TITLE')}
          />

          {/* 2D Turn-Based Combat Arena */}
          <div className="relative flex-1 w-full h-full flex items-center justify-center">
            <GameCanvas
              player={player}
              boss={boss}
              setPlayer={setPlayer}
              setBoss={setBoss}
              currentTurn={currentTurn}
              turnNumber={turnNumber}
              onBossTurnComplete={handleBossTurnComplete}
              onPlayerSkillFinished={handlePlayerSkillFinished}
              triggerBossTurnToken={triggerBossToken}
              onBossDefeated={onBossDefeated}
              onPlayerDefeated={onPlayerDefeated}
              isPaused={isPaused || gameStatus !== 'PLAYING'}
              queuedCard={queuedCard}
              onCardConsumed={() => setQueuedCard(null)}
              customBgUrl={customBgUrl}
              onDropBg={handleUploadBg}
            />
          </div>

          {/* Turn-Based Card Hand Bar & Action Controller */}
          <CardHandBar
            cards={handCards}
            player={player}
            currentTurn={currentTurn}
            turnNumber={turnNumber}
            onPlayCard={handlePlayCard}
            onEndTurn={handleEndTurn}
            selectedCardIndex={selectedCardIdx}
            isCastingSkill={isCastingSkill}
          />
        </>
      )}

      {/* Modals & Overlays */}
      <BossLoreModal isOpen={loreOpen} onClose={() => setLoreOpen(false)} />
      <DeckModal
        isOpen={deckOpen}
        onClose={() => setDeckOpen(false)}
        handCards={handCards}
        onSwapCard={handleSwapCard}
      />
      <ControlsGuideModal isOpen={guideOpen} onClose={() => setGuideOpen(false)} />
      <VictoryDefeatOverlay
        status={gameStatus === 'VICTORY' ? 'VICTORY' : gameStatus === 'DEFEAT' ? 'DEFEAT' : null}
        onRestart={handleRestart}
        onNextBoss={() => startMatch(2)}
        onBackToMenu={() => setGameStatus('TITLE')}
        currentBossId={currentBossId}
        playerScore={player.score}
      />
    </div>
  );
}
