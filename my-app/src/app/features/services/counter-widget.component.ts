import { Component, Input } from '@angular/core';
import { CounterService } from './counter.service';

@Component({
  selector: 'app-counter-widget',
  standalone: true,
  template: `
    <div class="counter-widget">
      <h3>{{ label }}</h3>
      <div class="counter-value"
           [class.text-danger]="svc.isNegative()"
           [class.text-muted]="svc.isZero()">
        {{ svc.count() }}
      </div>
      <div style="display:flex; gap:0.5rem; justify-content:center; flex-wrap:wrap;">
        <button class="btn btn-danger btn-sm"   (click)="svc.decrement()">−</button>
        <button class="btn btn-secondary btn-sm" (click)="svc.reset()">Reset</button>
        <button class="btn btn-success btn-sm"  (click)="svc.increment()">+</button>
      </div>
    </div>
  `
})
export class CounterWidgetComponent {
  @Input() label = 'Counter';

  constructor(public svc: CounterService) {}
}
