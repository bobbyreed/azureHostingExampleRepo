import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LifecycleChildComponent, HookEvent } from './lifecycle-child.component';

@Component({
    selector: 'app-lifecycle',
    imports: [FormsModule, LifecycleChildComponent],
    templateUrl: './lifecycle.component.html'
})
export class LifecycleComponent {
  showChild = false;
  inputValue = 'Hello';
  hookLog: (HookEvent & { index: number })[] = [];
  private logIndex = 0;

  onHook(event: HookEvent) {
    this.hookLog = [{ ...event, index: ++this.logIndex }, ...this.hookLog].slice(0, 30);
  }

  clearLog() { this.hookLog = []; this.logIndex = 0; }

  hookClass(type: string): string {
    const map: Record<string, string> = {
      init:    'hook-init',
      changes: 'hook-changes',
      destroy: 'hook-destroy',
      check:   'hook-check',
      view:    'hook-view',
      content: 'hook-content',
    };
    return map[type] ?? '';
  }

  readonly code = `@Component({ ... })
export class MyComponent implements
  OnChanges, OnInit, DoCheck,
  AfterContentInit, AfterContentChecked,
  AfterViewInit, AfterViewChecked, OnDestroy {

  @Input() value = '';

  // Called before ngOnInit and on every @Input change
  ngOnChanges(changes: SimpleChanges) {
    console.log('Input changed:', changes);
  }

  // Called once after first ngOnChanges
  ngOnInit() { /* initialize component */ }

  // Called after every change detection run
  ngDoCheck() { /* custom change detection */ }

  // Called after content projection (ng-content)
  ngAfterContentInit()    { }
  ngAfterContentChecked() { }

  // Called after component's view is rendered
  ngAfterViewInit()    { /* access @ViewChild here */ }
  ngAfterViewChecked() { }

  // Called just before the component is destroyed
  ngOnDestroy() { /* cleanup subscriptions */ }
}`;
}
