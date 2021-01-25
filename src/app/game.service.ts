import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, Observable, Subscription } from 'rxjs';
import { Cell } from './cell';
import { map, tap } from 'rxjs/operators';
import { chooseRandomIndex } from './choose-random-index';

const SIZE = 100;

const MIN = 500;
const MAX = 2000;

const INTERVAL = Math.floor(Math.random() * (MAX - MIN)) + MIN;

const initialState: Cell[] = [...Array(SIZE)].map(() => new Cell());

export enum GameState {
  NotStarted = 'NOT_STARTED',
  Active = 'ACTIVE',
  Paused = 'PAUSED',
  Finished = 'FINISHED'
}

export type GameScores = {
  player: number;
  npc: number;
}

@Injectable({
  providedIn: 'root'
})
export class GameService {
  public cells$: Observable<Cell[]>;
  public gameState$: Observable<GameState>;
  public scores$: Observable<GameScores>;

  private readonly _cells$ = new BehaviorSubject(initialState);
  private _gameState$ = new BehaviorSubject<GameState>(GameState.NotStarted);
  private readonly _ticker = interval(INTERVAL);
  private _subscription?: Subscription;

  constructor() {
    this.cells$ = this._cells$.asObservable();
    this.gameState$ = this._gameState$.asObservable();
    this.scores$ = this._cells$.pipe(map(cells => this._calculateGameScores(cells)));
  }

  public start() {
    if (this._gameState$.value === GameState.NotStarted) {
      this._subscription = this._ticker.pipe(tap(() => this.tick())).subscribe();
      this._gameState$.next(GameState.Active);
    }
    setTimeout(() => {
      this._finishGame();
    }, 1000)
  }

  public pause() {
    this._subscription?.unsubscribe();
    this._gameState$.next(GameState.Paused);
  }

  public restart() {
    this._cells$.next(initialState);
    this._subscription = this._ticker.pipe(tap(() => this.tick())).subscribe();
    this._gameState$.next(GameState.Active);
  }

  public tick() {
    this._update(cells => cells.map(cell => cell.resolve()));
    if (this._isGameOver()) {
      this._finishGame();
    } else {
      const activeIndex = this._chooseNewActive();
      this._update(cells => cells.map((cell, index) => index === activeIndex ? cell.activate() : cell));
    }
  }

  public touch(targetIndex: number) {
    this._update(cells => cells.map((cell, index) => index === targetIndex ? cell.touch() : cell));
  }

  private _isGameOver(): boolean {
    let counter: boolean = false;
    setTimeout((counter) => {
      counter == true
    }, 10000)
    const freeCells = this._cells$.value.filter(item => item.isInitial);
    return freeCells.length === 0;
  }

  private _finishGame(): void {
    this._subscription?.unsubscribe();
    this._gameState$.next(GameState.Finished);
  }

  private _update(reducer: (state: Cell[]) => Cell[]) {
    this._cells$.next(reducer(this._cells$.value));
  }

  private _chooseNewActive(): number {
    return chooseRandomIndex(this._cells$.value, (item) => item.isInitial);
  }

  private _calculateGameScores(cells: Cell[]): GameScores {
    const player = cells.reduce((result, cell) => cell.isCaught ? result + 1 : result, 0);
    const npc = cells.reduce((result, cell) => cell.isMissed ? result + 1 : result, 0);
    return { player, npc };
  }

}
