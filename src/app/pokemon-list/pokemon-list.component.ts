import { Component, inject, OnInit } from '@angular/core';
import { PokemonDataService } from '../services/pokemon-data.service';
import { PokemonListData } from '../interfaces/pokemon-list-data';
import { PokemonCardComponent } from '../pokemon-card/pokemon-card.component';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { FiltersComponent } from '../filters/filters.component';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [PokemonCardComponent, SearchBarComponent, FiltersComponent],
  templateUrl: './pokemon-list.component.html',
  styleUrl: './pokemon-list.component.css'
})
export class PokemonListComponent implements OnInit {

  pkmnService = inject(PokemonDataService);

  ngOnInit(): void {
      this.pkmnService.getPokemonList().subscribe(data => {
        this.pkmnService.updatePokemones(data);
      })
  }

  loadNextPage(){
    let newList:PokemonListData = this.pkmnService.getPokemones();
    if(newList.next != null){
      this.pkmnService.getPokemonList(this.pkmnService.getPokemones().next!).subscribe(data => {
        newList.next = data.next;
        newList.previus = data.previus;
        newList.results = newList.results.concat(data.results);
      })
    }
  }
}
