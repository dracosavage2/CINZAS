export interface Card {
  id: string;
  name: string;
  cost: number;
  description: string;
  type: 'attack' | 'defense' | 'heal' | 'utility' | 'special';
  damage?: number;
  defense?: number;
  heal?: number;
  cooldown?: number; // seconds
  currentCooldown?: number;
  color: string;
  iconName: string;
  flair: string;
}

export interface BossIntent {
  name: string;
  type: 'attack' | 'defense' | 'special';
  value: number;
  icon: 'Flame' | 'Shield' | 'Zap' | 'Droplets' | 'Sword' | 'Sparkles';
  description: string;
}

export interface PlayerStats {
  name: string;
  title: string;
  level: number;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  mana: number;
  maxMana: number;
  defense: number;
  defenseTurns: number;
  isDodging: boolean;
  dodgeCooldown: number;
  score: number;
}

export interface BossStats {
  id: 1 | 2; // Boss 1: Lorde das Sombras, Boss 2: Lorde do Vazio
  name: string;
  title: string;
  hp: number;
  maxHp: number;
  phase: 1 | 2;
  state: 'idle' | 'walk' | 'melee_charge' | 'melee_strike' | 'barrage_cast' | 'crows_cast' | 'air_jump' | 'air_slam' | 'zone_cast' | 'teleporting' | 'staggered' | 'defeated' | 'skill_cast' | 'hit_reaction' | 'shield_cast';
  actionTimer: number;
  x: number;
  y: number;
  facing: -1 | 1; // -1 left, 1 right
  isEnraged: boolean;
  targetX?: number;
  barrier?: number;
  barrierMax?: number;
  currentSkillName?: string;
  intent: BossIntent;
}

export type TurnPhase = 'player' | 'boss' | 'transition';

export interface Projectile {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  type: 'energy_ball' | 'shadow_chaos' | 'player_bolt' | 'player_card_rain' | 'boss_shadow_bolt' | 'boss_crow';
  damage: number;
  duration: number;
  maxDuration: number;
  rotation?: number;
  scale?: number;
}

export interface DamageNumber {
  id: string;
  x: number;
  y: number;
  value: string;
  color: string;
  life: number;
  maxLife: number;
}

export interface GroundHazard {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  state: 'warning' | 'active' | 'fading';
  duration: number;
  maxDuration: number;
  damage: number;
}

export interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;
  isMainGround?: boolean;
}

export type GameStatus = 'TITLE' | 'PLAYING' | 'PAUSED' | 'VICTORY' | 'DEFEAT';
