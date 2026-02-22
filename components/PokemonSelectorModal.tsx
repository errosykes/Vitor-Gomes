import React, { useState, useMemo } from 'react';
import type { Pokemon } from '../types.ts';
import { Search, X } from 'lucide-react';

interface PokemonSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  pokemonList: Pokemon[];
  onSelect: (pokemon: Pokemon) => void;
}

export const PokemonSelectorModal: React.FC<PokemonSelectorModalProps> = ({ isOpen, onClose, pokemonList, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPokemon = useMemo(() =>
    pokemonList.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    ), [pokemonList, searchTerm]
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-4 border-b flex justify-between items-center flex-shrink-0">
          <h2 className="text-2xl font-bold text-gray-800">Selecione um Pokémon</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <X size={24} />
          </button>
        </header>

        <div className="p-4 flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Procure por um Pokémon..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="overflow-y-auto p-4">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
            {filteredPokemon.map(pokemon => (
              <div
                key={pokemon.id}
                onClick={() => onSelect(pokemon)}
                className="cursor-pointer group p-2 border border-gray-200 rounded-lg hover:shadow-lg hover:border-indigo-500 transition-all text-center"
              >
                <img
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}
                  alt={pokemon.name}
                  className="w-full h-auto object-contain aspect-square group-hover:scale-105 transition-transform"
                  loading="lazy"
                  crossOrigin="anonymous"
                />
                <p className="mt-2 text-sm font-medium text-gray-700 truncate">{pokemon.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};