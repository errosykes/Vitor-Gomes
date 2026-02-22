
import React, { forwardRef, useMemo } from 'react';
import type { Trainer } from '../types.ts';
import { MapPin, Ruler, Cake, Fingerprint } from 'lucide-react';

interface TrainerCardProps {
  trainer: Trainer;
}

export const TrainerCard = forwardRef<HTMLDivElement, TrainerCardProps>(({ trainer }, ref) => {
  const { name, age, height, photo, city, pokemon, badges, cardTitle, customBackground } = trainer;
  const { theme } = city;
  const collectedBadges = badges.filter(b => b !== null);

  const bgStyle = customBackground 
    ? { 
        backgroundImage: `url(${customBackground})`, 
        backgroundSize: 'cover', 
        backgroundPosition: 'center' 
      } 
    : {};

  // Generate a fake ID based on name length/hash just for visuals
  const trainerID = useMemo(() => {
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return `ID No. ${hash.toString().padStart(5, '0')} - ${new Date().getFullYear()}`;
  }, [name]);

  return (
    <div 
        ref={ref} 
        className={`w-full aspect-[1.58/1] rounded-3xl p-6 shadow-2xl relative overflow-hidden text-white`}
        style={bgStyle}
    >
        {/* Dynamic Background Wrapper if no custom bg */}
        {!customBackground && (
            <div className={`absolute inset-0 bg-gradient-to-br ${theme.bg}`} />
        )}
        
        {/* Pattern Overlay - CSS only to avoid CORS/Load errors */}
        <div 
            className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay"
            style={{
                backgroundImage: 'radial-gradient(rgb(255 255 255 / 0.3) 1px, transparent 1px)',
                backgroundSize: '8px 8px'
            }}
        ></div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none"></div>

        {/* Main Layout Grid */}
        <div className="relative z-10 w-full h-full flex flex-col gap-4">
            
            {/* Top Bar: Name & ID */}
            <div className="flex justify-between items-start border-b border-white/20 pb-3">
                <div className="flex flex-col min-w-0 flex-1 mr-4">
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] sm:text-xs font-black tracking-[0.2em] uppercase bg-white/20 px-2 py-0.5 rounded backdrop-blur-md border border-white/10">
                            {cardTitle || 'TRAINER CARD'}
                        </span>
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter leading-none mt-1 drop-shadow-lg break-words min-w-0 leading-tight">
                        {name || 'Nome do Treinador'}
                    </h1>
                </div>
                <div className="flex flex-col items-end opacity-80 shrink-0">
                    <div className="flex items-center gap-1 text-[10px] sm:text-xs font-mono tracking-widest uppercase">
                         <Fingerprint size={12} />
                         <span>{trainerID}</span>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex gap-5 min-h-0">
                
                {/* Left Column: Photo & Stats */}
                <div className="w-[32%] flex flex-col gap-3 h-full">
                    {/* Photo */}
                    <div className="relative aspect-square w-full rounded-2xl overflow-hidden border-4 border-white/30 shadow-2xl bg-black/20 group shrink-0">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                        <img 
                            src={photo} 
                            alt="Trainer" 
                            className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                            crossOrigin="anonymous"
                        />
                    </div>

                    {/* Stats Panel */}
                    <div className="flex-1 bg-black/20 backdrop-blur-md rounded-xl p-3 border border-white/10 flex flex-col justify-center gap-2 shadow-inner min-h-0 overflow-hidden">
                        <div className="flex items-center gap-3 border-b border-white/10 pb-2 last:border-0 last:pb-0 shrink-0">
                            <div className="p-1.5 bg-white/10 rounded-lg">
                                <Cake size={16} className="text-white/90" />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-widest opacity-60">Idade</p>
                                <p className="font-bold leading-none">{age || '??'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 border-b border-white/10 pb-2 last:border-0 last:pb-0 shrink-0">
                            <div className="p-1.5 bg-white/10 rounded-lg">
                                <Ruler size={16} className="text-white/90" />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-widest opacity-60">Altura</p>
                                <p className="font-bold leading-none">{height || '??'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 border-b border-white/10 pb-2 last:border-0 last:pb-0 min-h-0">
                            <div className="p-1.5 bg-white/10 rounded-lg shrink-0">
                                <MapPin size={16} className="text-white/90" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-[10px] uppercase tracking-widest opacity-60">Origem</p>
                                <p className="font-bold leading-none truncate">{city.name}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Team & Badges */}
                <div className="flex-1 flex flex-col gap-3 min-w-0 h-full">
                    
                    {/* Pokemon Grid */}
                    <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/10 shadow-lg flex flex-col min-h-0 overflow-hidden">
                        <div className="flex justify-between items-center mb-2 px-1 shrink-0">
                             <span className="text-xs font-bold uppercase tracking-widest opacity-80">Equipe Ativa</span>
                             <div className="flex gap-1">
                                {[1,2,3,4,5,6].map(i => <div key={i} className={`w-1.5 h-1.5 rounded-full ${i <= pokemon.filter(p => p).length ? 'bg-green-400' : 'bg-white/20'}`} />)}
                             </div>
                        </div>
                        <div className="flex-1 grid grid-cols-3 gap-2 min-h-0 overflow-hidden">
                            {pokemon.map((p, index) => (
                                <div key={index} className="relative bg-black/20 rounded-xl border border-white/5 flex items-center justify-center overflow-hidden group hover:bg-black/30 transition-colors">
                                    <div className="absolute top-1 right-1 text-[8px] font-mono opacity-30 group-hover:opacity-100 transition-opacity z-20">
                                        #{String(index + 1).padStart(2, '0')}
                                    </div>
                                    {p ? (
                                        <>
                                            <div className="absolute inset-0 bg-white/5 rounded-full blur-xl transform scale-0 group-hover:scale-150 transition-transform duration-500"></div>
                                            <img
                                                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${p.id}.png`}
                                                alt={p.name}
                                                className="w-[85%] h-[85%] object-contain filter drop-shadow-lg transform group-hover:scale-110 transition-transform duration-300 relative z-10"
                                                crossOrigin="anonymous"
                                            />
                                        </>
                                    ) : (
                                        <div className="w-8 h-8 rounded-full border-2 border-dashed border-white/10 flex items-center justify-center opacity-20">
                                            <div className="w-2 h-2 bg-white rounded-full" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Badges Container */}
                    <div className="h-16 bg-gradient-to-r from-black/40 to-black/20 backdrop-blur-md rounded-xl border border-white/10 flex items-center px-4 shadow-lg shrink-0 overflow-hidden">
                        {collectedBadges.length > 0 ? (
                            <div className="flex justify-between w-full h-full py-2 gap-2">
                                {collectedBadges.map(badge => (
                                    <div key={badge!.id} className="h-full aspect-square flex items-center justify-center hover:-translate-y-1 transition-transform duration-300">
                                        <img 
                                            src={badge!.imageUrl} 
                                            alt="Badge" 
                                            className="max-h-full max-w-full object-contain filter drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]"
                                            crossOrigin="anonymous"
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center border-2 border-dashed border-white/10 rounded-lg">
                                <span className="text-[10px] uppercase tracking-[0.3em] opacity-40">Insígnias não registradas</span>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    </div>
  );
});
