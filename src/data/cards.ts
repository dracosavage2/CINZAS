import { Card } from '../types/game';

export const INITIAL_HAND_CARDS: Card[] = [
  {
    id: 'bola_de_energia',
    name: 'ATAQUE BÁSICO',
    cost: 1,
    description: 'Dispara um dardo arcano elétrico causando 60 de dano.',
    type: 'attack',
    damage: 60,
    cooldown: 0.8,
    color: 'from-blue-600 to-cyan-400',
    iconName: 'Zap',
    flair: 'Habilidade Base: canaliza energia estática na ponta dos dedos.'
  },
  {
    id: 'escudo_magico',
    name: 'CAMINHO DO CONHECIMENTO',
    cost: 1,
    description: 'Invoca uma barreira de cartas protetoras com 40 de defesa.',
    type: 'defense',
    defense: 40,
    cooldown: 2.0,
    color: 'from-blue-500 to-indigo-600',
    iconName: 'Shield',
    flair: 'Habilidade 2: abre o pergaminho e cria um escudo de cartas rúnicas.'
  },
  {
    id: 'chuva_de_cartas',
    name: 'SABEDORIA DAS CARTAS',
    cost: 3,
    description: 'Cartas em voo com relâmpagos e impacto rúnico com 90 de dano.',
    type: 'special',
    damage: 90,
    cooldown: 4.0,
    color: 'from-cyan-600 to-blue-500',
    iconName: 'Sparkles',
    flair: 'Habilidade 1: tempestade de cartas giratórias com selo místico no solo.'
  },
  {
    id: 'explosao_cosmica',
    name: 'O VERDADEIRO PODER',
    cost: 3,
    description: 'Carga de energia máxima celeste detonando 130 de dano crítico.',
    type: 'special',
    damage: 130,
    cooldown: 5.0,
    color: 'from-indigo-600 to-cyan-300',
    iconName: 'Sun',
    flair: 'Habilidade 3: ergue ambos os braços e conjura a explosão da bússola arcana.'
  },
  {
    id: 'teleporte',
    name: 'TELEPORTE ESPACIAL',
    cost: 2,
    description: 'Dobra o tecido do espaço esquivando do próximo golpe inimigo.',
    type: 'utility',
    cooldown: 3.5,
    color: 'from-purple-600 to-violet-400',
    iconName: 'Sparkles',
    flair: 'Passo etéreo que concede invulnerabilidade instantânea.'
  }
];

export const UNLOCKABLE_CARDS: Card[] = [
  {
    id: 'cura',
    name: 'CURA VITAL',
    cost: 2,
    description: 'Restaura 70 de vida.',
    type: 'heal',
    heal: 70,
    cooldown: 3.0,
    color: 'from-emerald-600 to-green-400',
    iconName: 'HeartPulse',
    flair: 'Canaliza o sopro vital para fechar ferimentos abismais.'
  },
  {
    id: 'golpe_de_alma',
    name: 'GOLPE DE ALMA',
    cost: 2,
    description: 'Causa 50 de dano e restaura +1 de Mana.',
    type: 'attack',
    damage: 50,
    cooldown: 2.0,
    color: 'from-indigo-600 to-cyan-500',
    iconName: 'Sword',
    flair: 'Corta o véu astral do inimigo e absorve sua energia vital.'
  },
  {
    id: 'drenagem_negra',
    name: 'DRENAGEM NEGRA',
    cost: 1,
    description: 'Causa 35 de dano e cura 35 de vida.',
    type: 'heal',
    damage: 35,
    heal: 35,
    cooldown: 2.5,
    color: 'from-rose-700 to-purple-800',
    iconName: 'Droplets',
    flair: 'Vampiriza a essência sombria das trevas para nutrir seu corpo.'
  }
];
