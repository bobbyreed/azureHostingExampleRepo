import { Component, signal, computed, ChangeDetectorRef, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-zoneless',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './zoneless.component.html'
})
export class ZonelessComponent {
  // All reactivity via signals — works perfectly without Zone.js
  count    = signal(0);
  name     = signal('Angular');
  doubled  = computed(() => this.count() * 2);
  greeting = computed(() => `Hello, ${this.name()}!`);

  log: string[] = [];

  increment()   { this.count.update(n => n + 1);  this.addLog('increment()');  }
  decrement()   { this.count.update(n => n - 1);  this.addLog('decrement()');  }
  resetCount()  { this.count.set(0);               this.addLog('reset()');      }
  setName(v: string) { this.name.set(v);           this.addLog(`name.set("${v}")`); }

  addLog(action: string) {
    const ts = new Date().toLocaleTimeString();
    this.log = [`[${ts}] ${action} → count=${this.count()}, doubled=${this.doubled()}`, ...this.log].slice(0, 8);
  }

  clearLog() { this.log = []; }

  readonly configCode = `// app.config.ts — Angular 21 new projects: zoneless by default
import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // Angular 21 new apps include this automatically
    provideZonelessChangeDetection(),
    // If you want zone.js instead (for existing code):
    // provideZoneChangeDetection({ eventCoalescing: true })
  ]
};

// package.json — zone.js is no longer a required dependency
// "zone.js" can be removed from polyfills in angular.json`;

  readonly whyCode = `// ── The problem with Zone.js ────────────────────────────
// Zone.js monkey-patches browser APIs (setTimeout, fetch, Promises,
// event listeners...) to trigger Angular change detection after
// every async operation. This causes:
// ❌ Unnecessary re-renders
// ❌ Slower Interaction-to-Next-Paint (INP) / Core Web Vitals
// ❌ Hidden performance pitfalls
// ❌ Large bundle size (~35kb)

// ── How zoneless works ───────────────────────────────────
// Angular tracks which signals are used in each component's template.
// When a signal changes, only affected components re-render.
// No monkey-patching. No unnecessary checks.

// ── What triggers change detection in zoneless ───────────
signal.set(value)          // ✅ Automatic — signal change triggers re-render
signal.update(fn)          // ✅ Automatic
computed(() => ...)        // ✅ Automatic — derived signal
async pipe  {{ '{{' }} obs$ | async {{ '}}' }}  // ✅ Automatic

// Manual trigger (rarely needed):
inject(ChangeDetectorRef).markForCheck();`;
}
