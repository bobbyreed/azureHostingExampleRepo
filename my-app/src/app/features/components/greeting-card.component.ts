import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-greeting-card',
  standalone: true,
  template: `
    <div class="greeting-card" [style.borderColor]="color">
      <h3>Hello, {{ name }}!</h3>
      <p>A component sent from the parent via &#64;Input()</p>
      <button class="btn btn-primary btn-sm" (click)="sendGreeting()">
        Emit Greeting
      </button>
    </div>
  `
})
export class GreetingCardComponent {
  @Input() name = 'World';
  @Input() color = '#667eea';
  @Output() greet = new EventEmitter<string>();

  sendGreeting() {
    this.greet.emit(`Hello from ${this.name}! 👋`);
  }
}
