import { Pokemon } from "./pokemon";

export interface PokemonListData {
  next: string | null;
  previus: string | null;
  results: Pokemon[] ;
}
