import { Component } from '@angular/core';
import { NgClass, NgStyle } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HighlightDirective } from './highlight.directive';

@Component({
    selector: 'app-directives',
    imports: [NgClass, NgStyle, FormsModule, HighlightDirective],
    templateUrl: './directives.component.html'
})
export class DirectivesComponent {
  // @if demo
  isVisible = true;

  // @for demo
  fruits = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry'];
  private extraFruits = ['Fig', 'Grape', 'Honeydew', 'Kiwi', 'Lemon', 'Mango'];
  private extraIndex = 0;

  addFruit() {
    this.fruits.push(this.extraFruits[this.extraIndex % this.extraFruits.length]);
    this.extraIndex++;
  }
  removeFruit(i: number) { this.fruits.splice(i, 1); }

  // @switch demo
  trafficLight: 'red' | 'yellow' | 'green' = 'red';
  nextLight() {
    const cycle: Record<string, 'red' | 'yellow' | 'green'> = {
      red: 'green', green: 'yellow', yellow: 'red'
    };
    this.trafficLight = cycle[this.trafficLight];
  }

  // ngClass demo
  alertType: 'success' | 'warning' | 'danger' = 'success';
  alertMessages: Record<string, string> = {
    success: 'Operation completed successfully!',
    warning: 'Proceed with caution.',
    danger:  'An error has occurred!'
  };

  // ngStyle demo
  boxColor = '#667eea';
  boxSize = 80;

  // Custom highlight directive colors
  highlightColors = [
    { color: '#fefcbf', label: 'Yellow' },
    { color: '#c6f6d5', label: 'Green' },
    { color: '#bee3f8', label: 'Blue' },
    { color: '#fed7e2', label: 'Pink' },
  ];

  readonly code = `// New control flow (@if, @for, @switch) — Angular 17+
@if (isVisible) {
  <p>I am visible!</p>
} @else {
  <p>I am hidden.</p>
}

@for (item of items; track item) {
  <li>{{ '{{' }} item {{ '}}' }}</li>
} @empty {
  <li>No items</li>
}

@switch (status) {
  @case ('active')   { <span class="badge-success">Active</span> }
  @case ('inactive') { <span class="badge-danger">Inactive</span> }
  @default           { <span>Unknown</span> }
}

// Attribute directives
<div [ngClass]="{ 'active': isActive, 'highlight': isHighlighted }"></div>
<div [ngStyle]="{ color: textColor, fontSize: size + 'px' }"></div>

// Custom attribute directive
@Directive({ selector: '[appHighlight]', standalone: true })
export class HighlightDirective {
  @Input() appHighlight = 'yellow';
  @HostListener('mouseenter') onEnter() {
    this.el.nativeElement.style.backgroundColor = this.appHighlight;
  }
  @HostListener('mouseleave') onLeave() {
    this.el.nativeElement.style.backgroundColor = '';
  }
}`;
}
