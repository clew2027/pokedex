
//pokemon list response
// Type the Pokémon list response (results)
// Type the Pokémon detail fields you render (name/types/height/weight/sprites/cries)
// Type the species fields you use to get an English flavor text entry

export interface PokemonURL {
    name: string;
    url: string;
}
  
export interface AllPokemonList {
    results: PokemonURL[];
}
  
export interface PokemonType {
    slot: number;
    type: {
        name: string;
        url: string;
    }
}


export interface Sprites {
    front_default: string | null;
    front_shiny: string | null;
    other?: {
        'official-artwork'?: {
        front_default: string | null;
        };
    };  
}

export interface Cries {
    latest: string | null;
    legacy: string | null;
}

export interface PokemonDetail {
  name: string;
  height: number;
  weight: number;
  types: PokemonType[];
  sprites: Sprites;
  cries: Cries;
}