import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PokemonCardData } from '../interfaces/pokemon-card-data';
import { BehaviorSubject, Observable, catchError, map, throwError } from 'rxjs';
import { PokemonListData } from '../interfaces/pokemon-list-data';
import { PokemonDetailsData } from '../interfaces/pokemon-details-data';

@Injectable({
  providedIn: 'root'
})
export class PokemonDataService {
  //Declaración del httpClient
  constructor(private http: HttpClient) { }

  //Declaración de la lista que se renderizará
  private _pokemones = new BehaviorSubject<PokemonListData>({ next: '', previus: '', results: [] });
  pokemones$ = this._pokemones.asObservable();

  //Función que devuelve la lista a renderizar
  getPokemones(): PokemonListData {
    return this._pokemones.value;
  }

  //Función que actualiza la lista a renderizar
  updatePokemones(newList: PokemonListData) {
    this._pokemones.next(newList);
  }

  //Función que devuelve una lista páginada de los pokemones
  getPokemonList(url: string = "https://pokeapi.co/api/v2/pokemon"): Observable<PokemonListData> {
    return this.http.get<PokemonListData>(url).pipe(
      map(res => ({
        next: res.next,
        previus: res.previus,
        results: res.results
      }))
    );
  }

  //Función que devuelve los datos del pokemon buscado en la web
  getSearched(name: string): Observable<PokemonListData> {
    return this.http.get<PokemonListData>(`https://pokeapi.co/api/v2/pokemon/${name}`).pipe(
      map(() => ({
        next: null,
        previus: null,
        results: [{ name: name }],
      })),
      catchError(error => {
        console.error('Error al obtener la lista de Pokémons:', error);
        return throwError(() => new Error('No se pudo obtener la lista de Pokémons.'));
      })
    );
  }

  //Función que devuelve los datos pertinentes para renderizar la tarjeta de los pokemones
  getPokemonData(name: string): Observable<PokemonCardData> {
    return this.http.get<PokemonCardData>(`https://pokeapi.co/api/v2/pokemon/${name}`).pipe(
      map(res => ({
        id: res.id,
        name: res.name,
        sprites: res.sprites,
        types: res.types.map(typeinfo => ({
          type: {
            name: typeinfo.type.name
          }
        }))
      })),
      catchError(error => {
        console.error(`Error al obtener los datos del Pokémon: ${name}`, error);
        return throwError(() => new Error(`No se pudieron obtener los datos del Pokémon: ${name}.`));
      })
    );
  }

  //Función que devuelve los datos pertinentes para renderizar la
  getPokemonDetails(id: number | string): Observable<PokemonDetailsData> {
    return this.http.get<PokemonDetailsData>(`https://pokeapi.co/api/v2/pokemon/${id}`).pipe(
      map(res => ({
        id: res.id,
        name: res.name,
        sprites: res.sprites,
        height: res.height,
        weight: res.weight,
        types: res.types.map(typeinfo => ({
          type: {
            name: typeinfo.type.name
          }
        })),
        stats: res.stats,
        moves: res.moves.slice(0, 3)
      })),
      catchError(error => {
        console.error(`Error al obtener los datos del Pokémon: ${id}`, error);
        return throwError(() => new Error(`No se pudieron obtener los datos del Pokémon: ${id}.`));
      })
    );
  }
}
