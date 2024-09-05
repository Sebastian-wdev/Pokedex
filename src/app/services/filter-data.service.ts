import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, catchError, throwError, of } from 'rxjs';
import { Pokemon } from '../interfaces/pokemon';
import { HttpClient } from '@angular/common/http';
import { Generation } from '../interfaces/generation';
import { Types } from '../interfaces/types';

@Injectable({
  providedIn: 'root'
})
export class FilterDataService {

  constructor(private http: HttpClient) { }

  private _filterActiveLists = new BehaviorSubject<Pokemon[][]>([[]])

  getFilterActiveLists() {
    this._filterActiveLists.value;
  }

  updateFilterActiveLists(newLists: Pokemon[][]) {
    this._filterActiveLists.next(newLists)
  }

  getGens(): Observable<Generation[]> {
    return this.http.get<any>("https://pokeapi.co/api/v2/generation").pipe(
      map(res => res.results.map((gen: any) => ({ name: gen.name }))),
      catchError(error => {
        console.error('Error al obtener las generaciones:', error);
        return throwError(() => new Error('No se pudieron obtener las generaciones.'));
      })
    );
  }

  getTypes(): Observable<Types[]> {
    return this.http.get<any>("https://pokeapi.co/api/v2/type?limit=18").pipe(
      map(res => res.results.map((type: any) => ({ name: type.name }))),
      catchError(error => {
        console.error('Error al obtener los tipos de Pokémon:', error);
        return throwError(() => new Error('No se pudieron obtener los tipos de Pokémon.'));
      })
    );
  }

  getPkmnByGen(name: string): Observable<Pokemon[]> {
    return this.http.get<any>(`https://pokeapi.co/api/v2/generation/${name}`).pipe(
      map(res => res.pokemon_species.map((pkmn: any) => ({ name: pkmn.name }))),
      catchError(error => {
        console.error(`Error al obtener los Pokémon de la generación: ${name}`, error);
        return throwError(() => new Error(`No se pudieron obtener los Pokémon de la generación: ${name}.`));
      })
    );
  }

  getPkmnByType(name: string): Observable<Pokemon[]> {
    return this.http.get<any>(`https://pokeapi.co/api/v2/type/${name}`).pipe(
      map(res => res.pokemon.map((pkmn: any) => ({ name: pkmn.pokemon.name }))),
      catchError(error => {
        console.error(`Error al obtener los Pokémon de tipo: ${name}`, error);
        return throwError(() => new Error(`No se pudieron obtener los Pokémon de tipo: ${name}.`));
      })
    );
  }

  filterPokemons(genPkmnList: Pokemon[], typePkmnList: Pokemon[]): Observable<Pokemon[]> {
    if (genPkmnList.length > 0 && typePkmnList.length > 0) {
      //Si recibe los dos parámetros, se filtrará por los dos criterios
      return of(genPkmnList).pipe(
        map(genList => genList.filter(genPkmn =>
          typePkmnList.some(typePkmn => typePkmn.name === genPkmn.name)
        )
        )
      );
    } else if (genPkmnList.length > 0) {
      //Solo se filtra por generacion
      return of(genPkmnList);
    } else if (typePkmnList.length > 0) {
      //Solo se filtra por tipo
      return of(typePkmnList);
    } else {
      //Si no se especifica ningun filtro, devolver una lista vacia
      return of([])
    }
  }
}
