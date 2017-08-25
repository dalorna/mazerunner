import { Component, OnInit, OnDestroy } from '@angular/core';
import { Main } from "../../files/main";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, OnDestroy {

  game: any;
  constructor() { }

  ngOnInit() {
    this.game = new Main();
  }

  ngOnDestroy(){
    this.game.destroy();
  }
}
