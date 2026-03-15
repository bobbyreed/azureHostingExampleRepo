import { Component, signal, computed, linkedSignal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-linked-signal',
  standalone: true,
  imports: [CurrencyPipe, FormsModule],
  templateUrl: './linked-signal.component.html'
})
export class LinkedSignalComponent {
  // ── Source signals ─────────────────────────────────
  basePrice   = signal(100);
  discountPct = signal(10);

  // computed() — read-only derived value
  taxedPrice = computed(() => this.basePrice() * 1.1);

  // linkedSignal() — derived AND writable
  // Resets to the computed formula whenever basePrice or discountPct changes.
  // But can be manually overridden until the next source change.
  discountedPrice = linkedSignal(
    () => this.basePrice() * (1 - this.discountPct() / 100)
  );

  // Track whether user has manually overridden
  manuallyOverridden = false;

  overridePrice(val: number) {
    this.discountedPrice.set(val);
    this.manuallyOverridden = true;
  }

  setBasePrice(val: number) {
    this.basePrice.set(val);
    this.manuallyOverridden = false; // resets automatically with source change
  }

  setDiscountPct(val: number) {
    this.discountPct.set(val);
    this.manuallyOverridden = false;
  }

  // ── Advanced form: linkedSignal with previous value ─
  // Keeps previous page's data while loading next page
  page = signal(1);

  private allData: Record<number, string[]> = {
    1: ['Angular', 'React', 'Vue', 'Svelte'],
    2: ['TypeScript', 'JavaScript', 'Rust', 'Go'],
    3: ['NgRx', 'Redux', 'Zustand', 'Jotai'],
  };

  // linkedSignal with computation that retains previous value
  pageItems = linkedSignal<number, string[]>({
    source: this.page,
    computation: (currentPage, previous) => {
      // While "loading" (in real app this would be async)
      return this.allData[currentPage] ?? previous?.value ?? [];
    }
  });

  prevPage() { if (this.page() > 1) this.page.update(p => p - 1); }
  nextPage() { if (this.page() < 3) this.page.update(p => p + 1); }

  readonly code = `import { signal, computed, linkedSignal } from '@angular/core';

// ── computed() — read-only ────────────────────────────
const base = signal(100);
const taxed = computed(() => base() * 1.1);

taxed.set(90); // ❌ TypeScript error — computed is Signal, not WritableSignal

// ── linkedSignal() — derived AND writable ─────────────
const discounted = linkedSignal(() => base() * 0.9);

discounted();     // → 90 (derived from base)
discounted.set(75); // ✅ manual override allowed
discounted();     // → 75

base.set(200);    // source changes → linkedSignal RESETS
discounted();     // → 180 (recomputed from new base)

// ── Advanced: linkedSignal with previous value ────────
const page = signal(1);

const items = linkedSignal<number, Item[]>({
  source: page,
  computation: (currentPage, previous) => {
    // 'previous.value' is the last resolved value
    // Useful for keeping stale data visible while loading
    return fetchPage(currentPage) ?? previous?.value ?? [];
  }
});`;
}
