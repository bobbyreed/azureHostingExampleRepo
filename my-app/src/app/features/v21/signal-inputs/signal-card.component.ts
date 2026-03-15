import { Component, input, output, model } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-signal-card',
  standalone: true,
  imports: [NgClass],
  template: `
    <div class="greeting-card" [style.borderColor]="color()">
      <h3>Hello, {{ name() }}!</h3>
      <p style="color:var(--text-muted);font-size:0.875rem;margin-bottom:0.75rem;">
        This card uses <code>input()</code>, <code>output()</code>, and <code>model()</code>
      </p>
      <div style="display:flex;gap:0.5rem;justify-content:center;flex-wrap:wrap;margin-bottom:0.75rem;">
        <button class="btn btn-primary btn-sm" (click)="onGreet()">
          Emit via output()
        </button>
        <button class="btn btn-sm"
                [ngClass]="liked() ? 'btn-danger' : 'btn-secondary'"
                (click)="liked.update(v => !v)">
          {{ liked() ? '❤️ Liked' : '🤍 Like' }}
        </button>
      </div>
      <p style="font-size:0.8rem;color:var(--text-muted);">
        model() value: <strong>{{ liked() }}</strong>
        &nbsp;(parent &amp; child stay in sync)
      </p>
    </div>
  `
})
export class SignalCardComponent {
  /** input.required() — no default, parent must provide */
  name = input.required<string>();

  /** input() with a default — parent can override */
  color = input('#667eea');

  /** model() — two-way bindable signal, child can update parent */
  liked = model(false);

  /** output() — replaces @Output() EventEmitter */
  greet = output<string>();

  onGreet() {
    this.greet.emit(`Hello from ${this.name()}! 👋`);
  }
}
