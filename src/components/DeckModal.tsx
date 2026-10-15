import React from 'react';
import { Card } from '../types/game';
import { X, Layers, Plus, Check } from 'lucide-react';
import { UNLOCKABLE_CARDS } from '../data/cards';

interface DeckModalProps {
  isOpen: boolean;
  onClose: () => void;
  handCards: Card[];
  onSwapCard: (removeIndex: number, newCard: Card) => void;
}

export const DeckModal: React.FC<DeckModalProps> = ({
  isOpen,
  onClose,
  handCards,
  onSwapCard
}) => {
  const [selectedHandIndex, setSelectedHandIndex] = React.useState<number>(0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg border-2 border-slate-700 bg-zinc-950 p-6 shadow-2xl text-slate-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-zinc-800 transition-colors"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
          <Layers className="w-6 h-6 text-cyan-400" />
          <div>
            <h2 className="font-cinzel text-xl font-bold uppercase tracking-wider text-slate-100">
              Deck do Sábio das Cartas
            </h2>
            <p className="text-xs text-slate-400">
              Gerencie as cartas ativas no seu cinto arcano para a batalha.
            </p>
          </div>
        </div>

        {/* Current Active Hand */}
        <div className="mt-5">
          <h3 className="text-xs font-bold font-cinzel uppercase text-slate-300 mb-2">
            Mão Ativa (Selecione um slot para substituir):
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {handCards.map((card, idx) => {
              const isSelected = selectedHandIndex === idx;
              return (
                <div
                  key={card.id}
                  onClick={() => setSelectedHandIndex(idx)}
                  className={`p-2.5 rounded-md border-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-cyan-400 bg-blue-950/40 shadow-[0_0_15px_rgba(56,189,248,0.3)] -translate-y-1'
                      : 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-600'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                    <span className="font-bold text-amber-300 font-mono-numbers">Slot #{idx + 1}</span>
                    <span className="px-1.5 py-0.5 rounded bg-blue-950 text-cyan-300 font-bold font-mono-numbers">
                      {card.cost} Mana
                    </span>
                  </div>
                  <h4 className="font-cinzel text-xs font-bold text-slate-100 uppercase truncate">
                    {card.name}
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-tight">
                    {card.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Available Collection / Unlockable Cards */}
        <div className="mt-6 pt-4 border-t border-zinc-800">
          <h3 className="text-xs font-bold font-cinzel uppercase text-amber-400 mb-2">
            Grimório Reserva: Cartas Disponíveis para Equipar
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {UNLOCKABLE_CARDS.map((card) => {
              const isAlreadyInHand = handCards.some((c) => c.id === card.id);
              return (
                <div
                  key={card.id}
                  className="p-3 rounded-md border border-zinc-800 bg-zinc-900/40 hover:border-amber-500/60 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono mb-1">
                      <span className="font-cinzel font-bold text-slate-200 uppercase">
                        {card.name}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-blue-950 border border-blue-500/60 text-cyan-300 font-bold font-mono-numbers">
                        {card.cost} Mana
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">
                      {card.description}
                    </p>
                    <p className="text-[10px] text-slate-400 italic mt-1.5">
                      {card.flair}
                    </p>
                  </div>

                  <button
                    disabled={isAlreadyInHand}
                    onClick={() => {
                      onSwapCard(selectedHandIndex, card);
                    }}
                    className={`mt-3 w-full py-1.5 px-3 rounded text-xs font-cinzel font-bold flex items-center justify-center gap-1.5 transition-colors ${
                      isAlreadyInHand
                        ? 'bg-zinc-800 text-zinc-400 cursor-not-allowed'
                        : 'bg-cyan-900/60 hover:bg-cyan-800 text-cyan-200 border border-cyan-600'
                    }`}
                  >
                    {isAlreadyInHand ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        Equipada na Mão
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        Equipar no Slot #{selectedHandIndex + 1}
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-3 border-t border-zinc-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded bg-slate-800 hover:bg-slate-700 text-white font-cinzel font-semibold text-xs transition-colors"
          >
            Concluir & Voltar
          </button>
        </div>
      </div>
    </div>
  );
};
