
export interface Pokemon {
  id: number;
  name: string;
}

export interface City {
  name: string;
  region: string;
  theme: {
    bg: string;
    text: string;
    accent: string;
    badgeBg: string;
  };
}

export interface Badge {
  id: string;
  imageUrl: string;
}

export interface Trainer {
  name: string;
  age: string;
  height: string;
  photo: string;
  city: City;
  pokemon: (Pokemon | null)[];
  badges: (Badge | null)[];
  cardTitle?: string;
  customBackground?: string;
}
