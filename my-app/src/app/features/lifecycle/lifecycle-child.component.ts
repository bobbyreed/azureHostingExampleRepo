import { Component, Input, Output, EventEmitter, OnChanges, OnInit, DoCheck,
         AfterContentInit, AfterContentChecked, AfterViewInit, AfterViewChecked,
         OnDestroy, SimpleChanges } from '@angular/core';

export interface HookEvent { hook: string; type: string; detail?: string; }

@Component({
  selector: 'app-lifecycle-child',
  standalone: true,
  template: `
    <div style="background:#ebf8ff; border:2px solid #bee3f8; border-radius:8px; padding:1rem; margin-top:0.75rem;">
      <p style="font-weight:600; color:#2b6cb0; margin-bottom:0.25rem;">Child Component</p>
      <p style="color:#4a5568; font-size:0.875rem;">
        Input value: <strong>"{{ inputValue }}"</strong>
      </p>
      <p style="color:#718096; font-size:0.8rem; margin:0;">
        I implement all 8 lifecycle hooks and emit each one to the parent.
      </p>
    </div>
  `
})
export class LifecycleChildComponent implements OnChanges, OnInit, DoCheck,
  AfterContentInit, AfterContentChecked, AfterViewInit, AfterViewChecked, OnDestroy {

  @Input() inputValue = '';
  @Output() hookFired = new EventEmitter<HookEvent>();

  private emit(hook: string, type: string, detail?: string) {
    this.hookFired.emit({ hook, type, detail });
  }

  ngOnChanges(changes: SimpleChanges) {
    const prev = changes['inputValue']?.previousValue;
    const curr = changes['inputValue']?.currentValue;
    this.emit('ngOnChanges', 'changes', prev !== undefined ? `"${prev}" → "${curr}"` : `"${curr}"`);
  }

  ngOnInit()              { this.emit('ngOnInit',              'init');    }
  ngDoCheck()             { this.emit('ngDoCheck',             'check');   }
  ngAfterContentInit()    { this.emit('ngAfterContentInit',    'content'); }
  ngAfterContentChecked() { this.emit('ngAfterContentChecked', 'content'); }
  ngAfterViewInit()       { this.emit('ngAfterViewInit',       'view');    }
  ngAfterViewChecked()    { this.emit('ngAfterViewChecked',    'view');    }
  ngOnDestroy()           { this.emit('ngOnDestroy',           'destroy'); }
}
