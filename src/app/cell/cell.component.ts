import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Cell } from '../cell';

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.scss']
})
export class CellComponent {
  @Input('data') public data?: Cell;
  @Output('touch') public touch = new EventEmitter<void>();
}
