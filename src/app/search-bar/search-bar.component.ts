import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PokemonDataService } from '../services/pokemon-data.service';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent {

  pkmnService = inject(PokemonDataService);

  searchForm = new FormGroup({
    query: new FormControl(''),
  });

  handleSubmit(){
    let qry = this.searchForm.value.query!.toLowerCase();
    this.pkmnService.getSearched(qry).subscribe(data => {
      this.pkmnService.updatePokemones(data);
    })
  }
}
