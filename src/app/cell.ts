export enum CellState {
  Initial = 'INITIAL',
  Active = 'ACTIVE',
  Catched = 'CATCHED',
  Missed = 'MISSED'
}

export class Cell {
  private readonly _state: CellState;

  constructor(state: CellState = CellState.Initial) {
    this._state = state;
  }

  public get isInitial(): boolean {
    return this._state === CellState.Initial;
  }

  public get isActive(): boolean {
    return this._state === CellState.Active;
  }

  public get isCaught(): boolean {
    return this._state === CellState.Catched;
  }

  public get isMissed(): boolean {
    return this._state === CellState.Missed;
  }


  public activate(): Cell {
    if (this.isInitial) {
      return new Cell(CellState.Active);
    } else {
      return this;
    }
  }

  public touch(): Cell {
    if (this.isActive) {
      return new Cell(CellState.Catched);
    } else {
      return this;
    }
  }

  public resolve() {
    if (this.isActive) {
      return new Cell(CellState.Missed);
    } else {
      return this;
    }
  }
}
