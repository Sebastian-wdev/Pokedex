import { Component, inject, OnInit } from '@angular/core';
import { PokemonDataService } from '../services/pokemon-data.service';
import { FilterDataService } from '../services/filter-data.service';
import { Types } from '../interfaces/types';
import { Generation } from '../interfaces/generation';
import { NgClass, TitleCasePipe } from '@angular/common';
import { Pokemon } from '../interfaces/pokemon';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [TitleCasePipe, NgClass],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.css'
})
export class FiltersComponent implements OnInit {
  pkmnService = inject(PokemonDataService);
  filterService = inject(FilterDataService);

  //Listas que contienen los nombres de los pokemones
  genPkmnList: Pokemon[] = [];
  typePkmnList:Pokemon[] = [];

  //Listas que contienen los nombre de las generaciones y tipos
  genList: Generation[] = [{ name: '' }];
  typesList: Types[] = [{ name: '' }];

  //Listas que contienen los nombres de las generaciones y tipos que estan activas en los botones
  activeGen: {[key: string]: boolean} = {};
  activeType: {[key: string]: boolean} = {};

  ngOnInit(): void {
    this.filterService.getTypes().subscribe(data => {
      this.typesList = data;
    });
    this.filterService.getGens().subscribe(data => {
      this.genList = data;
    })
  }

  updatePkmnList(){
    this.filterService.filterPokemons(this.genPkmnList, this.typePkmnList).subscribe(data =>{
      this.pkmnService.updatePokemones({next: null, previus: null, results: data})
    })
  }
  toggleGen(gen: string, pkmns: Pokemon[]):void{
    //Si se encuentra activa, borrará la lista de la generacion en genPkmnList
    if (this.activeGen[gen]){
      this.genPkmnList = this.genPkmnList.filter(
        pkmn => !pkmns.some(genPkmn => genPkmn.name === pkmn.name)
      )
    }else{
      //Si no está activa, se agrega la lista de la generacion en genPkmnList
      this.genPkmnList = [...this.genPkmnList, ...pkmns]
    }
    //Se cambia la propiedad de activa a inactiva y viceversa
    this.activeGen[gen] = !this.activeGen[gen]
    this.updatePkmnList();
  }

  toggleType(type: string, pkmns: Pokemon[]):void{
    //Si se encuentra activa, borrará la lista del tipo en typePkmnList
    if (this.activeType[type]){
      this.typePkmnList = this.typePkmnList.filter(
        pkmn => !pkmns.some(typePkmn => typePkmn.name === pkmn.name)
      )
    }else{
      //Si no está activa, se agrega la lista de los tipos en typePkmnList
      this.typePkmnList = [...this.typePkmnList, ...pkmns]
    }
    //Se cambia la propiedad de activa a inactiva y viceversa
    this.activeType[type] = !this.activeType[type]
    this.updatePkmnList();
  }

  handleClickGen(gen:string){
    this.filterService.getPkmnByGen(gen).subscribe(data =>{
      this.toggleGen(gen,data)
    })
  }
  handleClickType(type:string){
    this.filterService.getPkmnByType(type).subscribe(data =>{
      this.toggleType(type, data)
    })
  }

}
