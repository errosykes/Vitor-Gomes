import React from 'react';
import type { Badge } from '../types.ts';
import { PlusCircle, XCircle } from 'lucide-react';

interface BadgeSelectorProps {
  badges: (Badge | null)[];
  onBadgeChange: (e: React.ChangeEvent<HTMLInputElement>, index: number) => void;
  onBadgeRemove: (index: number) => void;
}

export const BadgeSelector: React.FC<BadgeSelectorProps> = ({ badges, onBadgeChange, onBadgeRemove }) => {
  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">Insígnias de Ginásio</h3>
      <p className="text-sm text-gray-500 mt-1">Envie até 8 imagens de insígnias (PNG recomendado).</p>
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-4 mt-4">
        {badges.map((badge, index) => (
          <div key={index} className="relative aspect-square">
            {badge ? (
              <>
                <div className="w-full h-full p-2 border border-gray-200 rounded-lg flex items-center justify-center">
                    <img src={badge.imageUrl} alt={`Insígnia ${index + 1}`} className="max-w-full max-h-full object-contain" />
                </div>
                <button
                  onClick={() => onBadgeRemove(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition"
                  aria-label="Remover Insígnia"
                >
                  <XCircle size={20} />
                </button>
              </>
            ) : (
              <label className="w-full h-full bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-indigo-500 hover:bg-gray-200 transition">
                <PlusCircle className="text-gray-400" size={24} />
                <input 
                  type="file" 
                  accept="image/png, image/jpeg, image/gif, image/webp" 
                  className="sr-only" 
                  onChange={(e) => onBadgeChange(e, index)} 
                />
              </label>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};