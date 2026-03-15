import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
    selector: 'app-nav',
    imports: [RouterLink, RouterLinkActive],
    templateUrl: './nav.component.html',
    styleUrl: './nav.component.css'
})
export class NavComponent {
  coreLinks = [
    { path: '/components', label: 'Components' },
    { path: '/directives', label: 'Directives' },
    { path: '/forms',      label: 'Forms' },
    { path: '/pipes',      label: 'Pipes' },
    { path: '/services',   label: 'Services' },
    { path: '/http',       label: 'HTTP' },
    { path: '/signals',    label: 'Signals' },
    { path: '/lifecycle',  label: 'Lifecycle' },
    { path: '/rxjs',       label: 'RxJS' },
  ];

  v21Links = [
    { path: '/v21/signal-inputs', label: 'Signal I/O' },
    { path: '/v21/linked-signal', label: 'linkedSignal' },
    { path: '/v21/http-resource', label: 'httpResource' },
    { path: '/v21/zoneless',      label: 'Zoneless' },
    { path: '/v21/signal-forms',  label: 'Signal Forms' },
  ];
}
