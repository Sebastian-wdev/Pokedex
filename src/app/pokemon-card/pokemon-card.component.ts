import { Component, inject, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PokemonDataService } from '../services/pokemon-data.service';
import { PokemonCardData } from '../interfaces/pokemon-card-data';
import { TitleCasePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-pokemon-card',
  standalone: true,
  imports: [TitleCasePipe, RouterLink],
  templateUrl: './pokemon-card.component.html',
  styleUrl: './pokemon-card.component.css'
})
export class PokemonCardComponent implements OnInit{

  @Input({required: true}) name!: string;
  @Input() isLast: boolean = false;
  @Output() loadedEvent = new EventEmitter<void>();

  pkmnService = inject(PokemonDataService);
  pkmn?: PokemonCardData;

  constructor(private _router: Router){}

  ngOnInit(): void{
    this.pkmnService.getPokemonData(this.name).subscribe(data =>{
      this.pkmn = data;
    });
    if (this.isLast){
      this.loadedEvent.emit();
    }
  }

  handleClick(){
    this._router.navigateByUrl(`/details/${this.pkmn?.id}`)
  }
}
