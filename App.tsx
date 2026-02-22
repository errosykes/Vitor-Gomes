
import React, { useState, useRef, useCallback } from 'react';
import { TrainerCard } from './components/TrainerCard.tsx';
import { TrainerForm } from './components/TrainerForm.tsx';
import { PokemonSelectorModal } from './components/PokemonSelectorModal.tsx';
import { ImageCropModal } from './components/ImageCropModal.tsx';
import { BadgeSelector } from './components/BadgeSelector.tsx';
import type { Trainer, Pokemon, Badge, City } from './types.ts';
import { CITIES, POKEMON_LIST } from './constants.ts';
import { Download, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [trainer, setTrainer] = useState<Trainer>({
    name: 'Ash Ketchum',
    age: '10',
    height: "1.65m",
    photo: 'https://i.imgur.com/g5G3fKk.png', // Default photo
    city: CITIES[0],
    pokemon: [null, null, null, null, null, null],
    badges: Array(8).fill(null),
    cardTitle: 'CARTÃO DE TREINADOR',
    customBackground: undefined,
  });
  const [isPokemonModalOpen, setIsPokemonModalOpen] = useState<boolean>(false);
  const [isCropModalOpen, setIsCropModalOpen] = useState<boolean>(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [editingSlot, setEditingSlot] = useState<number | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'cityPreset') {
      const selectedCity = CITIES.find(c => c.name === value) || CITIES[0];
      setTrainer(prev => ({ ...prev, city: selectedCity }));
    } else if (name === 'cityName') {
      setTrainer(prev => ({ 
        ...prev, 
        city: { ...prev.city, name: value } 
      }));
    } else {
      setTrainer(prev => ({ ...prev, [name]: value }));
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageToCrop(event.target?.result as string);
        setIsCropModalOpen(true);
      };
      reader.readAsDataURL(e.target.files[0]);
      e.target.value = '';
    }
  };

  const handleBackgroundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setTrainer(prev => ({ ...prev, customBackground: event.target?.result as string }));
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  
  const handleSaveCrop = (croppedImage: string) => {
    setTrainer(prev => ({ ...prev, photo: croppedImage }));
    setIsCropModalOpen(false);
    setImageToCrop(null);
  };

  const openPokemonSelector = (slot: number) => {
    setEditingSlot(slot);
    setIsPokemonModalOpen(true);
  };

  const handlePokemonSelect = (pokemon: Pokemon) => {
    if (editingSlot !== null) {
      const newPokemon = [...trainer.pokemon];
      newPokemon[editingSlot] = pokemon;
      setTrainer(prev => ({ ...prev, pokemon: newPokemon }));
    }
    setIsPokemonModalOpen(false);
    setEditingSlot(null);
  };

  const handlePokemonRemove = (slot: number) => {
    const newPokemon = [...trainer.pokemon];
    newPokemon[slot] = null;
    setTrainer(prev => ({ ...prev, pokemon: newPokemon }));
  };

  const handleBadgeChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        const newBadge: Badge = { id: `badge-${index}-${Date.now()}`, imageUrl };
        
        setTrainer(prev => {
          const newBadges = [...prev.badges];
          newBadges[index] = newBadge;
          return { ...prev, badges: newBadges };
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBadgeRemove = (index: number) => {
    setTrainer(prev => {
      const newBadges = [...prev.badges];
      newBadges[index] = null;
      return { ...prev, badges: newBadges };
    });
  };

  const handleDownload = useCallback(() => {
    if (cardRef.current) {
      // @ts-ignore
      html2canvas(cardRef.current, {
        useCORS: true,
        backgroundColor: null, 
        scale: 2, 
      }).then(canvas => {
        const link = document.createElement('a');
        link.download = `${trainer.name.toLowerCase().replace(/\s/g, '_')}_cartao_treinador.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      });
    }
  }, [trainer.name]);

  return (
    <div className="min-h-screen bg-gray-100 font-sans p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-[1800px] mx-auto">
        <header className="text-center mb-8">
          <div className="inline-flex items-center gap-3">
             <Sparkles className="text-yellow-500 w-8 h-8"/>
             <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 tracking-tight">
                Gerador de Cartão de Treinador
             </h1>
             <Sparkles className="text-yellow-500 w-8 h-8"/>
          </div>
          <p className="text-gray-600 mt-2">Crie sua própria identidade de treinador Pokémon!</p>
        </header>

        <main className="grid grid-cols-1 xl:grid-cols-[28rem_1fr] gap-8 items-start">
          <div className="bg-white p-6 rounded-xl shadow-lg">
             <TrainerForm 
                trainer={trainer} 
                onInputChange={handleInputChange} 
                onPhotoChange={handlePhotoChange}
                onPokemonSlotClick={openPokemonSelector}
                onPokemonRemove={handlePokemonRemove}
                onBackgroundChange={handleBackgroundChange}
                cities={CITIES} 
             />
             <BadgeSelector
                badges={trainer.badges}
                onBadgeChange={handleBadgeChange}
                onBadgeRemove={handleBadgeRemove}
             />
          </div>

          <div className="flex flex-col items-center w-full">
            <TrainerCard ref={cardRef} trainer={trainer} />
            <button
              onClick={handleDownload}
              className="mt-6 inline-flex items-center gap-2 px-8 py-3 bg-red-600 text-white font-bold rounded-lg shadow-md hover:bg-red-700 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-300"
            >
              <Download size={20} />
              Baixar Cartão
            </button>
          </div>
        </main>
      </div>

      <PokemonSelectorModal
        isOpen={isPokemonModalOpen}
        onClose={() => setIsPokemonModalOpen(false)}
        pokemonList={POKEMON_LIST}
        onSelect={handlePokemonSelect}
      />
      
      <ImageCropModal
        isOpen={isCropModalOpen}
        onClose={() => {
            setIsCropModalOpen(false);
            setImageToCrop(null);
        }}
        imageSrc={imageToCrop}
        onSave={handleSaveCrop}
      />
    </div>
  );
};

export default App;
