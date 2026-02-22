
import React from 'react';
import type { Trainer, City } from '../types.ts';
import { User, Cake, Ruler, MapPin, UploadCloud, PlusCircle, XCircle, Type, Image, Palette } from 'lucide-react';

interface InputGroupProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: React.ReactNode;
  placeholder: string;
}

const InputGroup: React.FC<InputGroupProps> = ({ label, name, value, onChange, icon, placeholder }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                {icon}
            </div>
            <input
                type="text"
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
        </div>
    </div>
);


interface TrainerFormProps {
  trainer: Trainer;
  cities: City[];
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onPhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBackgroundChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPokemonSlotClick: (slot: number) => void;
  onPokemonRemove: (slot: number) => void;
}

export const TrainerForm: React.FC<TrainerFormProps> = ({ trainer, cities, onInputChange, onPhotoChange, onBackgroundChange, onPokemonSlotClick, onPokemonRemove }) => {
  // Determine which city preset matches the current theme to control the select box
  // We use the theme reference to find the match, so the name can be custom
  const currentThemeCity = cities.find(c => c.theme === trainer.city.theme);

  return (
    <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">Informações do Treinador</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup label="Nome" name="name" value={trainer.name} onChange={onInputChange} icon={<User size={16}/>} placeholder="ex: Ash Ketchum" />
            <InputGroup label="Idade" name="age" value={trainer.age} onChange={onInputChange} icon={<Cake size={16}/>} placeholder="ex: 10" />
            <InputGroup label="Altura" name="height" value={trainer.height} onChange={onInputChange} icon={<Ruler size={16}/>} placeholder="ex: 1.65m" />
            
            <InputGroup 
                label="Cidade de Origem" 
                name="cityName" 
                value={trainer.city.name} 
                onChange={onInputChange} 
                icon={<MapPin size={16}/>} 
                placeholder="ex: Pallet Town" 
            />
            
            <div className="md:col-span-2">
                 <label htmlFor="cityPreset" className="block text-sm font-medium text-gray-700 mb-1">Tema / Região</label>
                 <div className="relative">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <Palette size={16} />
                     </div>
                    <select
                        id="cityPreset"
                        name="cityPreset"
                        value={currentThemeCity?.name || ''}
                        onChange={onInputChange}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        {cities.map(city => <option key={city.name} value={city.name}>{city.name} ({city.region})</option>)}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Muda as cores do cartão para combinar com a região.</p>
                 </div>
            </div>
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Foto do Treinador</label>
            <label htmlFor="photo-upload" className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-indigo-500 transition">
                <div className="space-y-1 text-center">
                    <UploadCloud className="mx-auto h-12 w-12 text-gray-400"/>
                    <div className="flex text-sm text-gray-600">
                        <p className="pl-1">Envie um arquivo ou arraste e solte</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF até 10MB</p>
                </div>
                <input id="photo-upload" name="photo" type="file" className="sr-only" accept="image/*" onChange={onPhotoChange} />
            </label>
        </div>

        <div>
           <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 mt-6">Personalização</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
               <InputGroup 
                  label="Título do Cartão" 
                  name="cardTitle" 
                  value={trainer.cardTitle || ''} 
                  onChange={onInputChange} 
                  icon={<Type size={16}/>} 
                  placeholder="CARTÃO DE TREINADOR" 
               />
               
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fundo Personalizado</label>
                  <label htmlFor="bg-upload" className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md shadow-sm cursor-pointer hover:bg-gray-50 hover:border-indigo-500 transition">
                      <Image size={18} className="text-gray-500" />
                      <span className="text-sm text-gray-600 truncate">
                        {trainer.customBackground ? 'Imagem selecionada (Clique para alterar)' : 'Enviar imagem de fundo'}
                      </span>
                      <input id="bg-upload" name="customBackground" type="file" className="sr-only" accept="image/*" onChange={onBackgroundChange} />
                  </label>
                  {trainer.customBackground && (
                     <button 
                        type="button"
                        onClick={() => {
                            // Helper to clear background - functionally needs App.tsx support or simple overwrite
                            // For UI consistency we just hide/show logic here
                        }}
                        className="text-xs text-red-500 mt-1 hover:underline hidden"
                     >
                        Remover fundo
                     </button>
                  )}
               </div>
           </div>
        </div>

        <div>
            <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 mt-6">Sua Equipe</h3>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 mt-4">
                {trainer.pokemon.map((p, index) => (
                    <div key={index} className="relative aspect-square">
                        <div 
                            className="w-full h-full bg-gray-200 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center cursor-pointer hover:border-indigo-500 hover:bg-gray-300 transition"
                            onClick={() => onPokemonSlotClick(index)}
                        >
                            {p ? (
                                <img
                                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${p.id}.png`}
                                    alt={p.name}
                                    className="w-full h-full object-contain p-1"
                                    crossOrigin="anonymous"
                                />
                            ) : (
                                <PlusCircle className="text-gray-500" size={32} />
                            )}
                        </div>
                        {p && (
                            <button
                                onClick={() => onPokemonRemove(index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition"
                                aria-label="Remover Pokémon"
                            >
                                <XCircle size={20} />
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};
