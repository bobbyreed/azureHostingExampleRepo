import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'components',
    loadComponent: () => import('./features/components/components.component').then(m => m.ComponentsComponent)
  },
  {
    path: 'directives',
    loadComponent: () => import('./features/directives/directives.component').then(m => m.DirectivesComponent)
  },
  {
    path: 'forms',
    loadComponent: () => import('./features/forms/forms.component').then(m => m.FormsComponent)
  },
  {
    path: 'pipes',
    loadComponent: () => import('./features/pipes/pipes.component').then(m => m.PipesComponent)
  },
  {
    path: 'services',
    loadComponent: () => import('./features/services/services.component').then(m => m.ServicesComponent)
  },
  {
    path: 'http',
    loadComponent: () => import('./features/http/http.component').then(m => m.HttpDemoComponent)
  },
  {
    path: 'signals',
    loadComponent: () => import('./features/signals/signals.component').then(m => m.SignalsComponent)
  },
  {
    path: 'lifecycle',
    loadComponent: () => import('./features/lifecycle/lifecycle.component').then(m => m.LifecycleComponent)
  },
  {
    path: 'rxjs',
    loadComponent: () => import('./features/rxjs/rxjs.component').then(m => m.RxjsComponent)
  },
  // Angular 21 feature pages
  {
    path: 'v21/signal-inputs',
    loadComponent: () => import('./features/v21/signal-inputs/signal-inputs.component').then(m => m.SignalInputsComponent)
  },
  {
    path: 'v21/linked-signal',
    loadComponent: () => import('./features/v21/linked-signal/linked-signal.component').then(m => m.LinkedSignalComponent)
  },
  {
    path: 'v21/http-resource',
    loadComponent: () => import('./features/v21/http-resource/http-resource.component').then(m => m.HttpResourceComponent)
  },
  {
    path: 'v21/zoneless',
    loadComponent: () => import('./features/v21/zoneless/zoneless.component').then(m => m.ZonelessComponent)
  },
  {
    path: 'v21/signal-forms',
    loadComponent: () => import('./features/v21/signal-forms/signal-forms.component').then(m => m.SignalFormsComponent)
  },
  { path: '**', redirectTo: '' }
];
