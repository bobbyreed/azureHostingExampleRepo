import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SignalCardComponent } from './signal-card.component';

@Component({
  selector: 'app-signal-inputs',
  standalone: true,
  imports: [FormsModule, SignalCardComponent],
  templateUrl: './signal-inputs.component.html'
})
export class SignalInputsComponent {
  // Signals fed into child inputs
  cardName  = signal('Angular Developer');
  cardColor = signal('#667eea');

  // WritableSignal bound two-way via child model()
  isLiked = signal(false);

  greeting = '';
  onGreet(msg: string) { this.greeting = msg; }

  // For the demo input fields
  nameInput  = 'Angular Developer';
  colorInput = '#667eea';

  updateName(v: string)  { this.nameInput = v;  this.cardName.set(v); }
  updateColor(v: string) { this.colorInput = v; this.cardColor.set(v); }
  toggleParentLike()     { this.isLiked.update(v => !v); }

  readonly code = `// child component
import { input, output, model } from '@angular/core';

export class SignalCardComponent {
  // Required input signal — compiler enforces parent provides it
  name = input.required<string>();

  // Optional input signal with default value
  color = input('#667eea');

  // model() — two-way bindable; child writes propagate to parent signal
  liked = model(false);

  // output() replaces @Output() EventEmitter
  greet = output<string>();

  onGreet() {
    this.greet.emit(\`Hello from \${this.name()}!\`);
  }
}

// parent template
<app-signal-card
  [name]="cardName()"
  [color]="cardColor()"
  [(liked)]="isLiked"
  (greet)="onGreet($event)" />

// Reading signals in the child template
{{ name() }}     // read input signal
{{ liked() }}    // read model signal
liked.update(v => !v)  // write model signal → updates parent too`;
}
