import { Component, signal, computed, effect } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Product { id: number; name: string; price: number; }
interface CartItem extends Product { qty: number; }

@Component({
    selector: 'app-signals',
    imports: [CurrencyPipe, FormsModule],
    templateUrl: './signals.component.html'
})
export class SignalsComponent {
  // Basic signal demo
  counter = signal(0);
  doubleCounter = computed(() => this.counter() * 2);
  counterLog: string[] = [];

  // Shopping cart with signals
  products: Product[] = [
    { id: 1, name: 'Angular Book',       price: 29.99 },
    { id: 2, name: 'TypeScript Course',  price: 49.99 },
    { id: 3, name: 'RxJS Guide',         price: 19.99 },
    { id: 4, name: 'NgRx Handbook',      price: 39.99 },
  ];

  cart = signal<CartItem[]>([]);
  cartTotal   = computed(() => this.cart().reduce((s, i) => s + i.price * i.qty, 0));
  cartCount   = computed(() => this.cart().reduce((s, i) => s + i.qty, 0));
  cartIsEmpty = computed(() => this.cart().length === 0);

  increment() { this.counter.update(n => n + 1); }
  decrement() { this.counter.update(n => n - 1); }

  constructor() {
    // effect() runs whenever counter changes
    effect(() => {
      const val = this.counter();
      this.counterLog = [`[effect] counter = ${val}`, ...this.counterLog].slice(0, 6);
    });
  }

  addToCart(product: Product) {
    this.cart.update(items => {
      const existing = items.find(i => i.id === product.id);
      if (existing) {
        return items.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...items, { ...product, qty: 1 }];
    });
  }

  removeFromCart(id: number) {
    this.cart.update(items => items.filter(i => i.id !== id));
  }

  clearCart() { this.cart.set([]); }

  readonly code = `import { signal, computed, effect } from '@angular/core';

// signal() — writable reactive value
counter = signal(0);

// Read:   counter()
// Write:  counter.set(5)
//         counter.update(n => n + 1)

// computed() — derived, read-only signal
doubleCounter = computed(() => this.counter() * 2);
// Auto-updates whenever counter changes

// effect() — runs as a side effect
constructor() {
  effect(() => {
    // Runs whenever counter() changes
    console.log('Counter:', this.counter());
  });
}

// Signals in objects (shopping cart)
cart = signal<CartItem[]>([]);

cartTotal = computed(() =>
  this.cart().reduce((sum, item) => sum + item.price * item.qty, 0)
);

addToCart(product: Product) {
  this.cart.update(items => {
    const existing = items.find(i => i.id === product.id);
    if (existing) {
      return items.map(i => i.id === product.id
        ? { ...i, qty: i.qty + 1 } : i);
    }
    return [...items, { ...product, qty: 1 }];
  });
}`;
}
