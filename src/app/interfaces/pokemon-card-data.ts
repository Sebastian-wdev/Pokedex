import { PokemonSprite } from "./pokemon-sprite";
import { PokemonType } from "./pokemon-type";

export interface PokemonCardData {
  id: number;
  name: string;
  types: PokemonType[];
  sprites: PokemonSprite;
}
