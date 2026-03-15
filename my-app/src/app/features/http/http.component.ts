import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

@Component({
    selector: 'app-http-demo',
    imports: [AsyncPipe, FormsModule],
    templateUrl: './http.component.html'
})
export class HttpDemoComponent {
  private http = inject(HttpClient);

  posts: Post[] = [];
  loading = false;
  error = '';
  filter = '';
  createResult = '';

  get filteredPosts(): Post[] {
    if (!this.filter.trim()) return this.posts;
    const q = this.filter.toLowerCase();
    return this.posts.filter(p => p.title.includes(q) || p.body.includes(q));
  }

  loadPosts() {
    this.loading = true;
    this.error = '';
    this.posts = [];
    this.http.get<Post[]>('https://jsonplaceholder.typicode.com/posts?_limit=10')
      .subscribe({
        next: data => { this.posts = data; this.loading = false; },
        error: err => { this.error = err.message; this.loading = false; }
      });
  }

  createPost() {
    this.createResult = '';
    const payload = { title: 'New Post', body: 'Created via HTTP POST', userId: 1 };
    this.http.post<Post>('https://jsonplaceholder.typicode.com/posts', payload)
      .subscribe({
        next: res => { this.createResult = `POST succeeded! New ID: ${res.id}`; },
        error: err => { this.createResult = `Error: ${err.message}`; }
      });
  }

  readonly code = `// Inject HttpClient (Angular 17 style)
private http = inject(HttpClient);

// GET request
this.http.get<Post[]>('https://api.example.com/posts')
  .subscribe({
    next: data  => { this.posts = data; },
    error: err  => { this.error = err.message; }
  });

// POST request
this.http.post<Post>('/api/posts', { title: 'Hello', body: '...' })
  .subscribe(res => console.log('Created:', res.id));

// Don't forget to add provideHttpClient() in app.config.ts:
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch())  // ← required
  ]
};`;
}
