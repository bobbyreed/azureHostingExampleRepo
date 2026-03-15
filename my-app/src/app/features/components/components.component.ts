import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GreetingCardComponent } from './greeting-card.component';

@Component({
    selector: 'app-components',
    imports: [FormsModule, GreetingCardComponent],
    templateUrl: './components.component.html'
})
export class ComponentsComponent {
  // Interpolation
  appName = 'Angular Features';
  version = '17';

  // Event binding
  clickCount = 0;

  // Two-way binding
  twoWayText = 'Edit me!';

  // Property binding (img)
  isImageVisible = true;

  // Child component
  cardName = 'Developer';
  cardColor = '#667eea';
  lastGreeting = '';

  handleClick() {
    this.clickCount++;
  }

  onGreet(msg: string) {
    this.lastGreeting = msg;
  }

  readonly code = `// greeting-card.component.ts
@Component({
  selector: 'app-greeting-card',
  standalone: true,
  template: \`
    <div [style.borderColor]="color">
      <h3>Hello, {{ '{{' }} name {{ '}}' }}!</h3>
      <button (click)="sendGreeting()">Emit Greeting</button>
    </div>
  \`
})
export class GreetingCardComponent {
  @Input() name = 'World';
  @Input() color = '#667eea';
  @Output() greet = new EventEmitter<string>();

  sendGreeting() {
    this.greet.emit(\`Hello from \${this.name}!\`);
  }
}

// Parent template usage:
// Interpolation:       {{ '{{' }} appName {{ '}}' }}
// Property binding:    [color]="cardColor"
// Event binding:       (click)="handleClick()"
// Two-way binding:     [(ngModel)]="twoWayText"
// Component + I/O:     <app-greeting-card [name]="cardName"
//                        (greet)="onGreet($event)" />`;
}
