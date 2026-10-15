import React, { useRef, useEffect, useCallback, useState } from 'react';
import { PlayerStats, BossStats, Projectile, DamageNumber, Card, TurnPhase, BossIntent } from '../types/game';
import { sounds } from '../utils/audio';
import { removeBackground } from '../utils/spriteProcessor';

// Stage Background
import bgImageSrc from '../assets/images/horizontal_bridge_arena_bg_1792038766467.jpg';

// Hero Sprites (Idle, Skill Cast, Hit Reaction)
import heroIdleSrc from '../assets/images/hero_mage_idle_1792039214836.jpg';
import heroCastSrc from '../assets/images/hero_cast_skill_1792040353189.jpg';
import heroHitSrc from '../assets/images/hero_hit_reaction_1792040338613.jpg';

// Boss Sprites (Idle, Skill Cast, Hit Reaction)
import bossIdleSrc from '../assets/images/boss_idle_cutout_1792035596581.jpg';
import bossCastSrc from '../assets/images/boss_skill_cast_1792040355196.jpg';
import bossHitSrc from '../assets/images/boss_hit_reaction_1792040352118.jpg';

// Skill VFX Assets
import skillEnergyBallSrc from '../assets/images/skill_energy_ball_1792040371228.jpg';
import skillMagicShieldSrc from '../assets/images/skill_magic_shield_1792040371680.jpg';
import skillShadowChaosSrc from '../assets/images/skill_shadow_chaos_1792040371363.jpg';
import skillHolyHealSrc from '../assets/images/skill_holy_heal_1792040394211.jpg';
import skillBossBarrierSrc from '../assets/images/skill_boss_barrier_1792040430602.jpg';

interface GameCanvasProps {
  player: PlayerStats;
  boss: BossStats;
  setPlayer: React.Dispatch<React.SetStateAction<PlayerStats>>;
  setBoss: React.Dispatch<React.SetStateAction<BossStats>>;
  currentTurn: TurnPhase;
  turnNumber: number;
  onBossTurnComplete: () => void;
  onPlayerSkillFinished: () => void;
  triggerBossTurnToken: number;
  onBossDefeated: () => void;
  onPlayerDefeated: () => void;
  isPaused: boolean;
  queuedCard: { card: Card; time: number } | null;
  onCardConsumed: () => void;
  customBgUrl?: string | null;
  onDropBg?: (file: File) => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  player,
  boss,
  setPlayer,
  setBoss,
  currentTurn,
  turnNumber,
  onBossTurnComplete,
  onPlayerSkillFinished,
  triggerBossTurnToken,
  onBossDefeated,
  onPlayerDefeated,
  isPaused,
  queuedCard,
  onCardConsumed,
  customBgUrl,
  onDropBg
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Background Image
  const bgImgRef = useRef<HTMLImageElement | null>(null);

  // Hero Cutout Canvases
  const heroIdleRef = useRef<HTMLCanvasElement | null>(null);
  const heroCastRef = useRef<HTMLCanvasElement | null>(null);
  const heroHitRef = useRef<HTMLCanvasElement | null>(null);

  // Boss Cutout Canvases
  const bossIdleRef = useRef<HTMLCanvasElement | null>(null);
  const bossCastRef = useRef<HTMLCanvasElement | null>(null);
  const bossHitRef = useRef<HTMLCanvasElement | null>(null);

  // Skill VFX Canvases
  const skillEnergyBallRef = useRef<HTMLCanvasElement | null>(null);
  const skillMagicShieldRef = useRef<HTMLCanvasElement | null>(null);
  const skillShadowChaosRef = useRef<HTMLCanvasElement | null>(null);
  const skillHolyHealRef = useRef<HTMLCanvasElement | null>(null);
  const skillBossBarrierRef = useRef<HTMLCanvasElement | null>(null);

  // Simulation State: Two stationary combatants in duel stance on the bridge platform (y = 400)
  const simState = useRef({
    playerDuel: {
      x: 270,
      y: 400,
      hp: player.hp,
      isDodging: false,
      facing: 1, // Facing boss to the right
      state: 'idle' as 'idle' | 'casting' | 'hit' | 'shield',
      stateTimer: 0,
      castSkillName: '',
      healAnimTimer: 0,
      shieldAuraTimer: 0
    },
    bossDuel: {
      x: 980,
      y: 400,
      hp: boss.hp,
      facing: -1, // Facing player to the left
      state: 'idle' as 'idle' | 'casting' | 'hit' | 'barrier',
      stateTimer: 0,
      currentSkill: '' as string,
      barrier: 0
    },
    actionBanner: {
      text: 'TURNO 1: SEU TURNO - ESCOLHA SUAS HABILIDADES',
      color: '#38bdf8',
      timer: 2.2
    },
    projectiles: [] as Projectile[],
    damageNumbers: [] as DamageNumber[],
    particles: [] as Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      life: number;
      maxLife: number;
      size: number;
    }>,
    screenShake: 0,
    lastTime: performance.now(),
    lastBossToken: 0
  });

  // 1. Preload and process transparent cutouts for all characters and skill VFX
  useEffect(() => {
    // Stage background
    const bg = new Image();
    bg.src = customBgUrl || bgImageSrc;
    bg.onload = () => {
      bgImgRef.current = bg;
    };

    // Hero Sprites
    const hIdle = new Image();
    hIdle.src = heroIdleSrc;
    hIdle.onload = () => {
      heroIdleRef.current = removeBackground(hIdle, 'black');
    };

    const hCast = new Image();
    hCast.src = heroCastSrc;
    hCast.onload = () => {
      heroCastRef.current = removeBackground(hCast, 'white');
    };

    const hHit = new Image();
    hHit.src = heroHitSrc;
    hHit.onload = () => {
      heroHitRef.current = removeBackground(hHit, 'white');
    };

    // Boss Sprites
    const bIdle = new Image();
    bIdle.src = bossIdleSrc;
    bIdle.onload = () => {
      bossIdleRef.current = removeBackground(bIdle, 'black');
    };

    const bCast = new Image();
    bCast.src = bossCastSrc;
    bCast.onload = () => {
      bossCastRef.current = removeBackground(bCast, 'white');
    };

    const bHit = new Image();
    bHit.src = bossHitSrc;
    bHit.onload = () => {
      bossHitRef.current = removeBackground(bHit, 'white');
    };

    // Skill VFX Assets (pure black background removal)
    const sEnergy = new Image();
    sEnergy.src = skillEnergyBallSrc;
    sEnergy.onload = () => {
      skillEnergyBallRef.current = removeBackground(sEnergy, 'black');
    };

    const sShield = new Image();
    sShield.src = skillMagicShieldSrc;
    sShield.onload = () => {
      skillMagicShieldRef.current = removeBackground(sShield, 'black');
    };

    const sChaos = new Image();
    sChaos.src = skillShadowChaosSrc;
    sChaos.onload = () => {
      skillShadowChaosRef.current = removeBackground(sChaos, 'black');
    };

    const sHeal = new Image();
    sHeal.src = skillHolyHealSrc;
    sHeal.onload = () => {
      skillHolyHealRef.current = removeBackground(sHeal, 'black');
    };

    const sBarrier = new Image();
    sBarrier.src = skillBossBarrierSrc;
    sBarrier.onload = () => {
      skillBossBarrierRef.current = removeBackground(sBarrier, 'black');
    };
  }, [customBgUrl]);

  // Turn Change Banner Trigger
  useEffect(() => {
    const s = simState.current;
    if (currentTurn === 'player') {
      s.actionBanner = {
        text: `TURNO ${turnNumber}: SEU TURNO! ESCOLHA SUAS CARTAS`,
        color: '#38bdf8',
        timer: 2.0
      };
    }
  }, [currentTurn, turnNumber]);

  // 2. PLAYER EXECUTES CARD (SKILL / POWER)
  useEffect(() => {
    if (!queuedCard) return;

    const { card } = queuedCard;
    const s = simState.current;
    const p = s.playerDuel;
    const b = s.bossDuel;

    // Trigger Hero Cast Skill Animation
    p.state = 'casting';
    p.stateTimer = 0.55;
    p.castSkillName = card.name;

    // Action banner
    s.actionBanner = {
      text: `JULIOSCAESAR CONJURA: ${card.name.toUpperCase()}!`,
      color: '#38bdf8',
      timer: 1.6
    };

    // Card Specific Mechanics
    if (card.id === 'bola_de_energia') {
      sounds.playSpellCast();
      // Fire fast Arcane Energy Ball towards Boss
      s.projectiles.push({
        id: `energy_ball_${Date.now()}`,
        x: p.x + 60,
        y: p.y - 70,
        vx: 24,
        vy: 0,
        radius: 22,
        color: '#38bdf8',
        type: 'energy_ball',
        damage: card.damage || 55,
        duration: 0,
        maxDuration: 2.0,
        rotation: 0
      });
    } else if (card.id === 'escudo_magico') {
      sounds.playShield();
      p.shieldAuraTimer = 1.8;
      // Add defense points to player stats
      setPlayer((prev) => ({
        ...prev,
        defense: prev.defense + (card.defense || 45)
      }));
      s.damageNumbers.push({
        id: `def_${Date.now()}`,
        x: p.x,
        y: p.y - 100,
        value: `+${card.defense || 45} DEFESA`,
        color: '#38bdf8',
        life: 0,
        maxLife: 1.2
      });
      // Arcane shield burst particles
      for (let i = 0; i < 25; i++) {
        s.particles.push({
          x: p.x,
          y: p.y - 50,
          vx: (Math.random() - 0.5) * 8,
          vy: (Math.random() - 0.5) * 8,
          color: '#38bdf8',
          life: 0,
          maxLife: 0.8,
          size: Math.random() * 4 + 2
        });
      }
    } else if (card.id === 'cura') {
      sounds.playHeal();
      p.healAnimTimer = 1.4;
      setPlayer((prev) => ({
        ...prev,
        hp: Math.min(prev.maxHp, prev.hp + (card.heal || 80)),
        mp: Math.min(prev.maxMp, prev.mp + 40)
      }));
      s.damageNumbers.push({
        id: `heal_${Date.now()}`,
        x: p.x,
        y: p.y - 95,
        value: `+${card.heal || 80} HP`,
        color: '#34d399',
        life: 0,
        maxLife: 1.4
      });
      for (let i = 0; i < 30; i++) {
        s.particles.push({
          x: p.x + (Math.random() - 0.5) * 60,
          y: p.y - Math.random() * 80,
          vx: (Math.random() - 0.5) * 3,
          vy: -Math.random() * 5 - 2,
          color: '#34d399',
          life: 0,
          maxLife: 1.0,
          size: Math.random() * 5 + 2
        });
      }
    } else if (card.id === 'chuva_de_cartas') {
      sounds.playCardRain();
      s.screenShake = 12;
      // Barrage of falling explosive cards raining directly upon the Boss
      for (let i = 0; i < 8; i++) {
        setTimeout(() => {
          s.projectiles.push({
            id: `card_rain_${Date.now()}_${i}`,
            x: b.x - 70 + Math.random() * 140,
            y: -20,
            vx: (Math.random() - 0.5) * 3,
            vy: 16 + Math.random() * 5,
            radius: 14,
            color: '#fbbf24',
            type: 'player_card_rain',
            damage: Math.round((card.damage || 80) / 4),
            duration: 0,
            maxDuration: 2.0,
            rotation: 0
          });
        }, i * 90);
      }
    } else if (card.id === 'golpe_de_alma') {
      sounds.playSpellCast();
      s.projectiles.push({
        id: `soul_bolt_${Date.now()}`,
        x: p.x + 60,
        y: p.y - 65,
        vx: 24,
        vy: 0,
        radius: 20,
        color: '#818cf8',
        type: 'energy_ball',
        damage: 60,
        duration: 0,
        maxDuration: 2.0
      });
      setPlayer((prev) => ({
        ...prev,
        mp: Math.min(prev.maxMp, prev.mp + 30)
      }));
    } else if (card.id === 'explosao_cosmica') {
      sounds.playSlam();
      s.screenShake = 22;
      // Trigger Boss Hit Reaction Immediately with Critical Strike
      b.state = 'hit';
      b.stateTimer = 0.7;
      s.damageNumbers.push({
        id: `cosmic_${Date.now()}`,
        x: b.x,
        y: b.y - 120,
        value: 'CRÍTICO! -130',
        color: '#fbbf24',
        life: 0,
        maxLife: 1.5
      });
      setBoss((prev) => {
        const nextHp = Math.max(0, prev.hp - 130);
        b.hp = nextHp;
        if (nextHp <= 0) {
          setTimeout(() => onBossDefeated(), 50);
        }
        return {
          ...prev,
          hp: nextHp,
          phase: nextHp <= prev.maxHp * 0.5 ? 2 : prev.phase
        };
      });
      // Supernova explosion particles
      for (let i = 0; i < 50; i++) {
        s.particles.push({
          x: b.x + (Math.random() - 0.5) * 100,
          y: b.y - 60 + (Math.random() - 0.5) * 100,
          vx: (Math.random() - 0.5) * 18,
          vy: (Math.random() - 0.5) * 18,
          color: i % 2 === 0 ? '#38bdf8' : '#f59e0b',
          life: 0,
          maxLife: 1.1,
          size: Math.random() * 7 + 3
        });
      }
    } else if (card.id === 'teleporte') {
      sounds.playTeleport();
      p.isDodging = true;
      setPlayer((prev) => ({
        ...prev,
        isDodging: true
      }));
      s.damageNumbers.push({
        id: `tele_${Date.now()}`,
        x: p.x,
        y: p.y - 100,
        value: '⚡ ESQUIVA ATIVADA',
        color: '#c084fc',
        life: 0,
        maxLife: 1.4
      });
      // Teleport warp burst particles
      for (let i = 0; i < 30; i++) {
        s.particles.push({
          x: p.x + (Math.random() - 0.5) * 70,
          y: p.y - 50 + (Math.random() - 0.5) * 70,
          vx: (Math.random() - 0.5) * 10,
          vy: (Math.random() - 0.5) * 10,
          color: '#a855f7',
          life: 0,
          maxLife: 0.9,
          size: Math.random() * 5 + 2
        });
      }
    } else if (card.id === 'drenagem_negra') {
      sounds.playSpellCast();
      s.projectiles.push({
        id: `drain_${Date.now()}`,
        x: p.x + 60,
        y: p.y - 65,
        vx: 24,
        vy: 0,
        radius: 18,
        color: '#ec4899',
        type: 'energy_ball',
        damage: 35,
        duration: 0,
        maxDuration: 2.0
      });
      setPlayer((prev) => ({
        ...prev,
        hp: Math.min(prev.maxHp, prev.hp + 35)
      }));
      s.damageNumbers.push({
        id: `drain_heal_${Date.now()}`,
        x: p.x,
        y: p.y - 95,
        value: '+35 HP DRENADO',
        color: '#34d399',
        life: 0,
        maxLife: 1.4
      });
    }

    onCardConsumed();

    // AUTOMATIC TURN TRANSITION:
    // Once player casts skill, allow brief time for projectile/impact to connect,
    // then automatically hand over turn to the Boss!
    const autoTransitionDelay = card.id === 'chuva_de_cartas' ? 950 : 700;
    setTimeout(() => {
      if (b.hp > 0) {
        onPlayerSkillFinished();
      }
    }, autoTransitionDelay);
  }, [queuedCard, onCardConsumed, setPlayer, setBoss, onBossDefeated, onPlayerSkillFinished]);

  // 3. BOSS TURN EXECUTION (Triggered when currentTurn switches to 'boss')
  useEffect(() => {
    if (currentTurn !== 'boss') return;
    if (triggerBossTurnToken === simState.current.lastBossToken) return;
    simState.current.lastBossToken = triggerBossTurnToken;

    const s = simState.current;
    const b = s.bossDuel;
    const p = s.playerDuel;

    if (boss.hp <= 0) return;

    // Announce Boss Turn
    s.actionBanner = {
      text: `TURNO DO ${boss.name}: ${boss.intent.name.toUpperCase()}!`,
      color: '#ef4444',
      timer: 2.0
    };

    // Boss enters Skill Casting Pose
    b.state = 'casting';
    b.stateTimer = 1.0;
    b.currentSkill = boss.intent.name;

    sounds.playBossRoar();

    // Execute based on telegraphed Boss Intent
    const executeIntent = () => {
      if (boss.intent.type === 'attack') {
        // Fire Chaos Skull Projectile across the bridge towards Hero
        s.projectiles.push({
          id: `boss_chaos_${Date.now()}`,
          x: b.x - 70,
          y: b.y - 75,
          vx: -22,
          vy: 0,
          radius: 26,
          color: '#dc2626',
          type: 'shadow_chaos',
          damage: boss.intent.value,
          duration: 0,
          maxDuration: 3.0,
          rotation: 0
        });
      } else if (boss.intent.type === 'defense') {
        sounds.playShield();
        b.barrier = (b.barrier || 0) + boss.intent.value;
        setBoss((prev) => ({
          ...prev,
          barrier: (prev.barrier || 0) + boss.intent.value,
          barrierMax: Math.max(prev.barrierMax || 0, (prev.barrier || 0) + boss.intent.value)
        }));
        s.damageNumbers.push({
          id: `boss_barr_${Date.now()}`,
          x: b.x,
          y: b.y - 110,
          value: `+${boss.intent.value} ESCUDO SOMBRIO`,
          color: '#f43f5e',
          life: 0,
          maxLife: 1.5
        });
        // Barrier particles
        for (let i = 0; i < 30; i++) {
          s.particles.push({
            x: b.x + (Math.random() - 0.5) * 80,
            y: b.y - 60 + (Math.random() - 0.5) * 80,
            vx: (Math.random() - 0.5) * 6,
            vy: (Math.random() - 0.5) * 6,
            color: '#dc2626',
            life: 0,
            maxLife: 0.9,
            size: 4
          });
        }
      } else if (boss.intent.type === 'special') {
        // Chaos Meteor Shower + Life Drain
        sounds.playCrows();
        s.screenShake = 16;
        for (let i = 0; i < 6; i++) {
          setTimeout(() => {
            s.projectiles.push({
              id: `chaos_rain_${Date.now()}_${i}`,
              x: p.x - 70 + Math.random() * 140,
              y: -20,
              vx: (Math.random() - 0.5) * 3,
              vy: 15 + Math.random() * 4,
              radius: 18,
              color: '#dc2626',
              type: 'shadow_chaos',
              damage: Math.round(boss.intent.value / 3),
              duration: 0,
              maxDuration: 2.5,
              rotation: 0
            });
          }, i * 110);
        }
      }

      // Schedule turn completion back to player after animation and projectile resolution
      setTimeout(() => {
        if (s.playerDuel.hp > 0 && s.bossDuel.hp > 0) {
          onBossTurnComplete();
        }
      }, 1500);
    };

    setTimeout(executeIntent, 400);
  }, [currentTurn, triggerBossTurnToken, boss, setBoss, onBossTurnComplete]);

  // Projectile Collision and Update Loop
  const updateProjectilesAndCollisions = useCallback((dt: number) => {
    const s = simState.current;
    const p = s.playerDuel;
    const b = s.bossDuel;

    const remainingProjectiles: Projectile[] = [];

    for (const proj of s.projectiles) {
      proj.x += proj.vx;
      proj.y += proj.vy;
      proj.duration += dt;

      let hit = false;

      // Hero -> Boss hits
      if (proj.vx > 0 || proj.type === 'player_card_rain') {
        const dx = proj.x - b.x;
        const dy = proj.y - (b.y - 70);
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < proj.radius + 60 || (proj.type === 'player_card_rain' && proj.y >= b.y - 30 && Math.abs(proj.x - b.x) < 70)) {
          hit = true;
          sounds.playHit();
          s.screenShake = 10;

          // Trigger Boss Hit Reaction Sprite
          b.state = 'hit';
          b.stateTimer = 0.55;

          // Barrier Absorption
          let actualDmg = proj.damage;
          if (b.barrier && b.barrier > 0) {
            const absorbed = Math.min(b.barrier, actualDmg);
            b.barrier -= absorbed;
            actualDmg -= absorbed;

            setBoss((prev) => ({
              ...prev,
              barrier: Math.max(0, (prev.barrier || 0) - absorbed)
            }));

            s.damageNumbers.push({
              id: `barr_abs_${Date.now()}_${Math.random()}`,
              x: b.x,
              y: b.y - 120,
              value: `ESCUDO BLOQUEOU ${absorbed}!`,
              color: '#f43f5e',
              life: 0,
              maxLife: 1.2
            });
          }

          if (actualDmg > 0) {
            setBoss((prev) => {
              const nextHp = Math.max(0, prev.hp - actualDmg);
              b.hp = nextHp;
              if (nextHp <= 0) {
                setTimeout(() => onBossDefeated(), 50);
              }
              return {
                ...prev,
                hp: nextHp,
                phase: nextHp <= prev.maxHp * 0.5 ? 2 : prev.phase
              };
            });

            s.damageNumbers.push({
              id: `dmg_${Date.now()}_${Math.random()}`,
              x: b.x + (Math.random() - 0.5) * 40,
              y: b.y - 80 - Math.random() * 20,
              value: `-${actualDmg}`,
              color: '#fbbf24',
              life: 0,
              maxLife: 1.3
            });
          }

          // Impact Sparks
          for (let i = 0; i < 20; i++) {
            s.particles.push({
              x: b.x,
              y: b.y - 60,
              vx: (Math.random() - 0.5) * 12,
              vy: (Math.random() - 0.5) * 12,
              color: '#38bdf8',
              life: 0,
              maxLife: 0.6,
              size: Math.random() * 4 + 2
            });
          }
        }
      }

      // Boss -> Hero hits
      if (proj.vx < 0 || (proj.type === 'shadow_chaos' && proj.vy > 0)) {
        const dx = proj.x - p.x;
        const dy = proj.y - (p.y - 65);
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < proj.radius + 50 || (proj.y >= p.y - 25 && Math.abs(proj.x - p.x) < 60)) {
          hit = true;

          // Check if Hero has Dodge (Teleporte) Active!
          if (player.isDodging || p.isDodging) {
            sounds.playTeleport();
            p.isDodging = false;
            setPlayer((prev) => ({
              ...prev,
              isDodging: false
            }));

            s.damageNumbers.push({
              id: `p_dodge_${Date.now()}_${Math.random()}`,
              x: p.x,
              y: p.y - 110,
              value: '⚡ ESQUIVOU! DANO 0',
              color: '#38bdf8',
              life: 0,
              maxLife: 1.4
            });

            // Teleport evasion particles
            for (let i = 0; i < 25; i++) {
              s.particles.push({
                x: p.x + (Math.random() - 0.5) * 60,
                y: p.y - 50 + (Math.random() - 0.5) * 60,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                color: '#c084fc',
                life: 0,
                maxLife: 0.7,
                size: 4
              });
            }
          } else {
            // Normal hit: Apply shield and damage
            sounds.playHit();
            s.screenShake = 14;

            // Check Player Shield / Defense
            let damageToHp = proj.damage;
            if (player.defense > 0) {
              const absorbed = Math.min(player.defense, damageToHp);
              damageToHp -= absorbed;
              setPlayer((prev) => ({
                ...prev,
                defense: Math.max(0, prev.defense - absorbed)
              }));

              sounds.playShield();
              p.shieldAuraTimer = 1.0;

              s.damageNumbers.push({
                id: `p_barr_${Date.now()}_${Math.random()}`,
                x: p.x,
                y: p.y - 110,
                value: `DEFESA ABSORVEU ${absorbed}!`,
                color: '#38bdf8',
                life: 0,
                maxLife: 1.4
              });
            }

            if (damageToHp > 0) {
              // Trigger Hero Hit Reaction
              p.state = 'hit';
              p.stateTimer = 0.65;

              setPlayer((prev) => {
                const nextHp = Math.max(0, prev.hp - damageToHp);
                p.hp = nextHp;
                if (nextHp <= 0) {
                  setTimeout(() => onPlayerDefeated(), 50);
                }
                return {
                  ...prev,
                  hp: nextHp
                };
              });

              s.damageNumbers.push({
                id: `p_dmg_${Date.now()}_${Math.random()}`,
                x: p.x + (Math.random() - 0.5) * 30,
                y: p.y - 80,
                value: `-${damageToHp}`,
                color: '#ef4444',
                life: 0,
                maxLife: 1.3
              });
            }

            // Sparks
            for (let i = 0; i < 20; i++) {
              s.particles.push({
                x: p.x,
                y: p.y - 60,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                color: '#dc2626',
                life: 0,
                maxLife: 0.6,
                size: Math.random() * 4 + 2
              });
            }
          }
        }
      }

      if (!hit && proj.duration < proj.maxDuration && proj.x > -100 && proj.x < 1380) {
        remainingProjectiles.push(proj);
      }
    }

    s.projectiles = remainingProjectiles;
  }, [player.defense, setPlayer, setBoss, onBossDefeated, onPlayerDefeated]);

  // Main Render & Animation Loop
  useEffect(() => {
    let animId: number;

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const now = performance.now();
      const dt = Math.min(0.05, (now - simState.current.lastTime) / 1000);
      simState.current.lastTime = now;

      if (!isPaused) {
        // Timers update
        const p = simState.current.playerDuel;
        const b = simState.current.bossDuel;
        const banner = simState.current.actionBanner;

        if (p.stateTimer > 0) {
          p.stateTimer -= dt;
          if (p.stateTimer <= 0) p.state = 'idle';
        }
        if (p.healAnimTimer > 0) p.healAnimTimer -= dt;
        if (p.shieldAuraTimer > 0) p.shieldAuraTimer -= dt;

        if (b.stateTimer > 0) {
          b.stateTimer -= dt;
          if (b.stateTimer <= 0) b.state = 'idle';
        }

        if (banner.timer > 0) {
          banner.timer -= dt;
        }

        // Screen shake decay
        if (simState.current.screenShake > 0) {
          simState.current.screenShake = Math.max(0, simState.current.screenShake - dt * 25);
        }

        // Damage numbers update
        simState.current.damageNumbers.forEach((d) => (d.life += dt));
        simState.current.damageNumbers = simState.current.damageNumbers.filter(
          (d) => d.life < d.maxLife
        );

        // Particles update
        simState.current.particles.forEach((part) => {
          part.x += part.vx;
          part.y += part.vy;
          part.life += dt;
        });
        simState.current.particles = simState.current.particles.filter(
          (part) => part.life < part.maxLife
        );

        // Projectiles
        updateProjectilesAndCollisions(dt);
      }

      // DRAW CANVAS
      ctx.save();

      // Screen Shake
      if (simState.current.screenShake > 0) {
        const sx = (Math.random() - 0.5) * simState.current.screenShake;
        const sy = (Math.random() - 0.5) * simState.current.screenShake;
        ctx.translate(sx, sy);
      }

      // 1. Background
      if (bgImgRef.current && bgImgRef.current.complete) {
        ctx.drawImage(bgImgRef.current, 0, 0, canvas.width, canvas.height);
      } else {
        const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        bgGrad.addColorStop(0, '#09090b');
        bgGrad.addColorStop(1, '#020617');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Atmospheric Vignette & Bridge glow
      ctx.fillStyle = 'rgba(0,0,0,0.25)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Duel Floor Guide
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.15)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(120, 420);
      ctx.lineTo(1160, 420);
      ctx.stroke();

      const p = simState.current.playerDuel;
      const b = simState.current.bossDuel;

      // 2. HERO RENDERING (Stationary at x: 270, y: 400)
      ctx.save();
      // Hero Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.55)';
      ctx.beginPath();
      ctx.ellipse(p.x, p.y + 12, 45, 12, 0, 0, Math.PI * 2);
      ctx.fill();

      // Active Shield Aura if player has defense
      if (player.defense > 0 || p.shieldAuraTimer > 0) {
        if (skillMagicShieldRef.current) {
          ctx.save();
          ctx.globalAlpha = 0.85;
          ctx.drawImage(
            skillMagicShieldRef.current,
            p.x - 70,
            p.y - 120,
            140,
            140
          );
          ctx.restore();
        } else {
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(p.x, p.y - 50, 65, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // Healing Light Pillar VFX
      if (p.healAnimTimer > 0 && skillHolyHealRef.current) {
        ctx.save();
        ctx.globalAlpha = Math.min(1, p.healAnimTimer);
        ctx.drawImage(
          skillHolyHealRef.current,
          p.x - 75,
          p.y - 170,
          150,
          200
        );
        ctx.restore();
      }

      // Pick Sprite Canvas for Hero State
      let activeHeroCanvas: HTMLCanvasElement | null = null;
      if (p.state === 'hit' && heroHitRef.current) {
        activeHeroCanvas = heroHitRef.current;
      } else if (p.state === 'casting' && heroCastRef.current) {
        activeHeroCanvas = heroCastRef.current;
      } else if (heroIdleRef.current) {
        activeHeroCanvas = heroIdleRef.current;
      }

      const heroW = 145;
      const heroH = 145;

      if (activeHeroCanvas) {
        ctx.save();
        ctx.translate(p.x, p.y - heroH * 0.5);
        if (p.facing === -1) ctx.scale(-1, 1);
        ctx.drawImage(
          activeHeroCanvas,
          -heroW * 0.5,
          -heroH * 0.5,
          heroW,
          heroH
        );
        ctx.restore();
      } else {
        // Fallback
        ctx.fillStyle = '#3b82f6';
        ctx.fillRect(p.x - 25, p.y - 90, 50, 90);
      }

      // Hero Nameplate
      ctx.fillStyle = '#e2e8f0';
      ctx.font = 'bold 12px "Cinzel", serif';
      ctx.textAlign = 'center';
      ctx.fillText('JULIOSCAESAR', p.x, p.y - 95);

      if (player.defense > 0) {
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 10px monospace';
        ctx.fillText(`🛡️ +${player.defense} DEFESA`, p.x, p.y - 80);
      }
      ctx.restore();

      // 3. BOSS RENDERING (Stationary at x: 980, y: 400)
      ctx.save();
      // Boss Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.beginPath();
      ctx.ellipse(b.x, b.y + 14, 55, 14, 0, 0, Math.PI * 2);
      ctx.fill();

      // Boss Barrier Aura
      if (boss.barrier && boss.barrier > 0) {
        if (skillBossBarrierRef.current) {
          ctx.save();
          ctx.globalAlpha = 0.85;
          ctx.drawImage(
            skillBossBarrierRef.current,
            b.x - 90,
            b.y - 140,
            180,
            180
          );
          ctx.restore();
        } else {
          ctx.strokeStyle = '#dc2626';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.arc(b.x, b.y - 65, 85, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // Pick Sprite Canvas for Boss State
      let activeBossCanvas: HTMLCanvasElement | null = null;
      if (b.state === 'hit' && bossHitRef.current) {
        activeBossCanvas = bossHitRef.current;
      } else if (b.state === 'casting' && bossCastRef.current) {
        activeBossCanvas = bossCastRef.current;
      } else if (bossIdleRef.current) {
        activeBossCanvas = bossIdleRef.current;
      }

      const bossW = 165;
      const bossH = 165;

      if (activeBossCanvas) {
        ctx.save();
        ctx.translate(b.x, b.y - bossH * 0.5);
        if (b.facing === 1) ctx.scale(-1, 1);
        ctx.drawImage(
          activeBossCanvas,
          -bossW * 0.5,
          -bossH * 0.5,
          bossW,
          bossH
        );
        ctx.restore();
      } else {
        // Fallback
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(b.x - 35, b.y - 110, 70, 110);
      }

      // Boss Nameplate & Phase Badge
      ctx.fillStyle = boss.phase === 2 ? '#f87171' : '#ef4444';
      ctx.font = 'bold 13px "Cinzel", serif';
      ctx.textAlign = 'center';
      ctx.fillText(boss.name, b.x, b.y - 110);

      // 4. TELEGRAPHED BOSS INTENT BADGE (Above Boss's Head)
      if (boss.intent && boss.hp > 0) {
        const intentY = b.y - 150;
        const isAttack = boss.intent.type === 'attack';
        const isDef = boss.intent.type === 'defense';

        // Badge Container
        ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
        ctx.strokeStyle = isAttack ? '#ef4444' : isDef ? '#38bdf8' : '#c084fc';
        ctx.lineWidth = 1.5;

        const badgeW = 150;
        const badgeH = 28;
        const rx = b.x - badgeW * 0.5;
        const ry = intentY - badgeH * 0.5;

        ctx.beginPath();
        ctx.roundRect(rx, ry, badgeW, badgeH, 6);
        ctx.fill();
        ctx.stroke();

        // Icon + Intent description
        ctx.textAlign = 'center';
        ctx.font = 'bold 11px "Cinzel", serif';
        ctx.fillStyle = '#ffffff';

        const symbol = isAttack ? '⚔️' : isDef ? '🛡️' : '☄️';
        const valText = isDef ? `+${boss.intent.value} Def` : `${boss.intent.value} Dano`;
        ctx.fillText(`${symbol} ${boss.intent.name.slice(0, 10)} (${valText})`, b.x, intentY + 4);
      }
      ctx.restore();

      // 5. PROJECTILES RENDERING
      simState.current.projectiles.forEach((proj) => {
        ctx.save();
        if (proj.type === 'energy_ball' && skillEnergyBallRef.current) {
          ctx.drawImage(
            skillEnergyBallRef.current,
            proj.x - proj.radius * 1.6,
            proj.y - proj.radius * 1.6,
            proj.radius * 3.2,
            proj.radius * 3.2
          );
        } else if (proj.type === 'shadow_chaos' && skillShadowChaosRef.current) {
          ctx.drawImage(
            skillShadowChaosRef.current,
            proj.x - proj.radius * 1.6,
            proj.y - proj.radius * 1.6,
            proj.radius * 3.2,
            proj.radius * 3.2
          );
        } else {
          // Glow orb fallback
          ctx.shadowBlur = 15;
          ctx.shadowColor = proj.color;
          ctx.fillStyle = proj.color;
          ctx.beginPath();
          ctx.arc(proj.x, proj.y, proj.radius, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      // 6. PARTICLES
      simState.current.particles.forEach((pt) => {
        const alpha = Math.max(0, 1 - pt.life / pt.maxLife);
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = pt.color;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // 7. DAMAGE NUMBERS
      simState.current.damageNumbers.forEach((d) => {
        const alpha = Math.max(0, 1 - d.life / d.maxLife);
        const floatY = d.y - d.life * 30;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = d.color;
        ctx.shadowColor = 'black';
        ctx.shadowBlur = 6;
        ctx.font = '900 16px "Cinzel", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(d.value, d.x, floatY);
        ctx.restore();
      });

      // 8. TURN ACTION BANNER NOTIFICATION (Center Screen)
      const banner = simState.current.actionBanner;
      if (banner && banner.timer > 0) {
        ctx.save();
        const alpha = Math.min(1, banner.timer);
        ctx.globalAlpha = alpha;

        const bannerW = 600;
        const bannerH = 46;
        const bx = canvas.width * 0.5 - bannerW * 0.5;
        const by = 80;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
        ctx.strokeStyle = banner.color;
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.roundRect(bx, by, bannerW, bannerH, 8);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = banner.color;
        ctx.font = 'bold 15px "Cinzel", serif';
        ctx.textAlign = 'center';
        ctx.shadowColor = banner.color;
        ctx.shadowBlur = 10;
        ctx.fillText(banner.text, canvas.width * 0.5, by + 29);
        ctx.restore();
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [isPaused, player.defense, boss.name, boss.phase, boss.intent, boss.barrier, boss.hp, updateProjectilesAndCollisions]);

  return (
    <div
      className="relative w-full h-full flex items-center justify-center bg-black overflow-hidden"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file && onDropBg) {
          onDropBg(file);
        }
      }}
    >
      <canvas
        ref={canvasRef}
        width={1280}
        height={720}
        className="w-full h-full max-w-[1280px] max-h-[720px] object-contain shadow-2xl rounded-lg"
      />
    </div>
  );
};
