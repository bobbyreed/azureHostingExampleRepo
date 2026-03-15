import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { Subject, BehaviorSubject, interval, fromEvent, Observable } from 'rxjs';
import {
  debounceTime, distinctUntilChanged, map, filter, takeUntil,
  scan, startWith
} from 'rxjs/operators';

interface SearchResult { id: number; title: string; }

const MOCK_DATA: SearchResult[] = [
  { id: 1, title: 'Angular Components' },
  { id: 2, title: 'RxJS Observables' },
  { id: 3, title: 'TypeScript Generics' },
  { id: 4, title: 'Angular Signals' },
  { id: 5, title: 'Reactive Forms' },
  { id: 6, title: 'HTTP Client' },
  { id: 7, title: 'Angular Router' },
  { id: 8, title: 'NgRx State Management' },
];

@Component({
    selector: 'app-rxjs',
    imports: [FormsModule, AsyncPipe],
    templateUrl: './rxjs.component.html'
})
export class RxjsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Debounced search
  searchTerm = '';
  private search$ = new Subject<string>();
  searchResults: SearchResult[] = [];
  searchStatus = 'Type to search…';

  // BehaviorSubject event bus
  private events$ = new BehaviorSubject<string[]>([]);
  events: string[] = [];

  // Interval counter (takeUntil)
  tick = 0;
  timerRunning = false;
  private timerStop$ = new Subject<void>();

  // scan() accumulator demo
  clicks = 0;
  private click$ = new Subject<void>();
  clickTotal$!: Observable<number>;

  ngOnInit() {
    // debounceTime + distinctUntilChanged
    this.search$.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      map(term => term.toLowerCase().trim()),
      takeUntil(this.destroy$)
    ).subscribe(term => {
      if (!term) {
        this.searchResults = [];
        this.searchStatus = 'Type to search…';
      } else {
        this.searchResults = MOCK_DATA.filter(d => d.title.toLowerCase().includes(term));
        this.searchStatus = `${this.searchResults.length} results for "${term}"`;
      }
    });

    // scan() — accumulates values
    this.clickTotal$ = this.click$.pipe(
      scan((acc) => acc + 1, 0),
      startWith(0),
      takeUntil(this.destroy$)
    );

    // BehaviorSubject
    this.events$.pipe(takeUntil(this.destroy$))
      .subscribe(evts => this.events = evts);
  }

  onSearch(term: string) { this.search$.next(term); }

  emitEvent(type: string) {
    const ts = new Date().toLocaleTimeString();
    this.events$.next([`[${ts}] ${type}`, ...this.events$.value].slice(0, 8));
  }

  clickSubject() { this.click$.next(); }

  startTimer() {
    if (this.timerRunning) return;
    this.timerRunning = true;
    this.timerStop$ = new Subject<void>();
    interval(1000).pipe(
      takeUntil(this.timerStop$)
    ).subscribe(() => this.tick++);
  }

  stopTimer() {
    this.timerRunning = false;
    this.timerStop$.next();
    this.timerStop$.complete();
  }

  resetTimer() { this.stopTimer(); this.tick = 0; }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  readonly code = `// Subject — multicast observable, no initial value
private search$ = new Subject<string>();

// BehaviorSubject — has initial value, emits to late subscribers
private events$ = new BehaviorSubject<string[]>([]);

// Operators pipeline
this.search$.pipe(
  debounceTime(400),           // wait 400ms after last emission
  distinctUntilChanged(),      // ignore duplicate values
  map(term => term.toLowerCase()),
  filter(term => term.length > 0),
  takeUntil(this.destroy$)     // auto-unsubscribe on destroy
).subscribe(term => { /* handle */ });

// interval + takeUntil
private stop$ = new Subject<void>();
interval(1000)
  .pipe(takeUntil(this.stop$))
  .subscribe(n => this.tick = n);

// scan() — accumulates values like Array.reduce
clicks$ = clickSubject$.pipe(
  scan((total) => total + 1, 0),
  startWith(0)
);

// Cleanup in ngOnDestroy
ngOnDestroy() {
  this.destroy$.next();
  this.destroy$.complete();
}`;
}
