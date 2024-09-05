import { PokemonSprite } from "./pokemon-sprite";
import { PokemonType } from "./pokemon-type";

export interface PokemonDetailsData {
  id: number;
  name: string;
  types: PokemonType[];
  sprites: PokemonSprite;
  weight: number;
  height:number;
  stats: { base_stat: number, stat: { name: string } }[];
  moves: { move: { name: string, type?: {name: string}} }[];
}
