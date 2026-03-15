import { Component } from '@angular/core';
import { CounterWidgetComponent } from './counter-widget.component';
import { CounterService } from './counter.service';

@Component({
    selector: 'app-services',
    imports: [CounterWidgetComponent],
    templateUrl: './services.component.html'
})
export class ServicesComponent {
  constructor(public svc: CounterService) {}

  readonly code = `// counter.service.ts
@Injectable({ providedIn: 'root' })
export class CounterService {
  private _count = signal(0);

  readonly count      = this._count.asReadonly();
  readonly isNegative = computed(() => this._count() < 0);

  increment() { this._count.update(n => n + 1); }
  decrement() { this._count.update(n => n - 1); }
  reset()     { this._count.set(0); }
}

// counter-widget.component.ts
// The service is injected — both widgets share the SAME instance
constructor(public svc: CounterService) {}

// Template: {{ '{{' }} svc.count() {{ '}}' }}

// services.component.html — two widgets, one service
<app-counter-widget label="Widget A" />
<app-counter-widget label="Widget B" />
// Clicking +/- in either widget updates both — shared state!`;
}
