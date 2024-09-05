import { Component, inject, Input, OnInit } from '@angular/core';
import { PokemonDetailsData } from '../interfaces/pokemon-details-data';
import { PokemonDataService } from '../services/pokemon-data.service';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-pokemon-details',
  standalone: true,
  imports: [TitleCasePipe],
  templateUrl: './pokemon-details.component.html',
  styleUrl: './pokemon-details.component.css'
})
export class PokemonDetailsComponent implements OnInit {
  pkmnService = inject(PokemonDataService);

  pkmnId: number | string =-1;

  @Input()
  set id(value: number | string){
    this.pkmnId = value;
  }

  pkmnData: PokemonDetailsData = {
    id: 0,
    name: '',
    sprites: {
      front_default: '',
    },
    height: 0,
    weight: 0,
    types: [],
    stats: [],
    moves: [],
  }

  ngOnInit(): void {
    this.pkmnService.getPokemonDetails(this.pkmnId).subscribe(data => {
      this.pkmnData = data;
     });
  }

}
