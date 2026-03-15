import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CounterService {
  private _count = signal(0);

  readonly count = this._count.asReadonly();
  readonly isNegative = computed(() => this._count() < 0);
  readonly isZero = computed(() => this._count() === 0);

  increment() { this._count.update(n => n + 1); }
  decrement() { this._count.update(n => n - 1); }
  reset()     { this._count.set(0); }
}
