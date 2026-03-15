import { Component } from '@angular/core';
import { DatePipe, CurrencyPipe, DecimalPipe, UpperCasePipe, LowerCasePipe,
         SlicePipe, JsonPipe, AsyncPipe, PercentPipe, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TruncatePipe } from './truncate.pipe';
import { of, delay } from 'rxjs';

@Component({
    selector: 'app-pipes',
    imports: [
        DatePipe, CurrencyPipe, DecimalPipe, UpperCasePipe, LowerCasePipe,
        SlicePipe, JsonPipe, AsyncPipe, PercentPipe, TitleCasePipe,
        FormsModule, TruncatePipe
    ],
    templateUrl: './pipes.component.html'
})
export class PipesComponent {
  today = new Date();
  price = 1234567.89;
  ratio = 0.7531;
  bigNumber = 9876543.21;
  sampleText = 'the quick brown fox jumps over the lazy dog';
  truncateText = 'This is a long string that will be truncated using our custom TruncatePipe when it exceeds the limit.';
  truncateLimit = 50;
  sampleArray = ['Angular', 'React', 'Vue', 'Svelte', 'Solid', 'Qwik'];
  sampleObj = { framework: 'Angular', version: 17, standalone: true };

  // async pipe demo — simulates a delayed value
  asyncValue$ = of('Loaded from async pipe!').pipe(delay(1500));

  readonly code = `// Built-in pipes (no import needed in templates if CommonModule is used)
{{ '{{' }} today | date:'fullDate' {{ '}}' }}
// → Thursday, March 14, 2024

{{ '{{' }} 1234567.89 | currency:'USD' {{ '}}' }}
// → $1,234,567.89

{{ '{{' }} 9876543.21 | number:'1.2-2' {{ '}}' }}
// → 9,876,543.21

{{ '{{' }} 'hello world' | titlecase {{ '}}' }}
// → Hello World

{{ '{{' }} 0.7531 | percent:'1.1-1' {{ '}}' }}
// → 75.3%

{{ '{{' }} ['a','b','c','d'] | slice:1:3 {{ '}}' }}
// → ['b', 'c']

// Async pipe — subscribes & unsubscribes automatically
{{ '{{' }} observable$ | async {{ '}}' }}

// Custom pipe
@Pipe({ name: 'truncate', standalone: true })
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit = 50, ellipsis = '...'): string {
    if (value.length <= limit) return value;
    return value.slice(0, limit) + ellipsis;
  }
}

// Usage: {{ '{{' }} text | truncate:30:'…' {{ '}}' }}`;
}
