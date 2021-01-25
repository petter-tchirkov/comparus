import { Component } from '@angular/core';
import { GameScores, GameService, GameState } from './game.service';
import { Observable } from 'rxjs';
import { Cell } from './cell';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public cells$: Observable<Cell[]>;
  public gameState$: Observable<GameState>;
  public scores$: Observable<GameScores>;

  constructor(private readonly game: GameService) {
    this.cells$ = game.cells$;
    this.gameState$ = game.gameState$;
    this.scores$ = game.scores$;
  }

  public touchCell(index: number) {
    this.game.touch(index);
  }

  public startGame() {
    this.game.start();
  }

  public pauseGame() {
    this.game.pause();
  }

  public playAgain() {
    this.game.restart();
  }

  counter = 60;
  interval = 1000;
}
