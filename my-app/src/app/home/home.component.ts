import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-home',
    imports: [RouterLink],
    templateUrl: './home.component.html'
})
export class HomeComponent {
  coreFeatures = [
    { path: '/components', icon: '🧩', title: 'Components',   desc: 'Interpolation, property/event binding, Input & Output' },
    { path: '/directives', icon: '🎨', title: 'Directives',   desc: '@if, @for, @switch, ngClass, ngStyle, custom directives' },
    { path: '/forms',      icon: '📝', title: 'Forms',         desc: 'Reactive forms, validation, FormBuilder, FormArray' },
    { path: '/pipes',      icon: '🔧', title: 'Pipes',         desc: 'Built-in pipes: date, currency, async + custom pipes' },
    { path: '/services',   icon: '⚙️',  title: 'Services',      desc: 'Dependency injection, shared state between components' },
    { path: '/http',       icon: '🌐', title: 'HTTP Client',   desc: 'Fetch data, loading states, error handling' },
    { path: '/signals',    icon: '⚡', title: 'Signals',       desc: 'signal(), computed(), effect() — reactive state' },
    { path: '/lifecycle',  icon: '🔄', title: 'Lifecycle',     desc: 'All lifecycle hooks in order of execution' },
    { path: '/rxjs',       icon: '🌊', title: 'RxJS',          desc: 'Observables, operators, debounce, subjects' },
  ];

  v21Features = [
    { path: '/v21/signal-inputs', icon: '📡', title: 'Signal I/O',     desc: 'input(), output(), model() — replace @Input/@Output decorators' },
    { path: '/v21/linked-signal', icon: '🔗', title: 'linkedSignal',   desc: 'Writable derived signal — bridges signal() and computed()' },
    { path: '/v21/http-resource', icon: '🚀', title: 'httpResource',   desc: 'Reactive HTTP + resource() — no subscribe, no cleanup' },
    { path: '/v21/zoneless',      icon: '🏎️', title: 'Zoneless',       desc: 'No zone.js — signal-driven change detection, default in v21' },
    { path: '/v21/signal-forms',  icon: '📋', title: 'Signal Forms',   desc: 'Experimental form API built on WritableSignal + schema validators' },
  ];
}
