import { Component, signal, resource } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { SlicePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Post { userId: number; id: number; title: string; body: string; }
interface User { id: number; name: string; email: string; phone: string; website: string; }
interface Comment { id: number; name: string; email: string; body: string; }

@Component({
  selector: 'app-http-resource',
  standalone: true,
  imports: [FormsModule, SlicePipe],
  templateUrl: './http-resource.component.html'
})
export class HttpResourceComponent {
  // ── httpResource — reactive HTTP with automatic status signals ────────────
  selectedUserId = signal(1);

  userResource = httpResource<User>(
    () => `https://jsonplaceholder.typicode.com/users/${this.selectedUserId()}`
  );

  postsResource = httpResource<Post[]>(
    () => `https://jsonplaceholder.typicode.com/posts?userId=${this.selectedUserId()}&_limit=5`
  );

  // ── resource() — generic async resource with a custom loader ─────────────
  searchId = signal(1);

  commentResource = resource<Comment[], number>({
    params: () => this.searchId(),
    loader: ({ params: id, abortSignal }) =>
      fetch(`https://jsonplaceholder.typicode.com/comments?postId=${id}&_limit=4`, { signal: abortSignal })
        .then(r => r.json()) as Promise<Comment[]>
  });

  setUser(id: number) { this.selectedUserId.set(id); }
  setCommentPost(id: number) { this.searchId.set(id); }

  readonly code = `import { httpResource } from '@angular/common/http';
import { resource, signal } from '@angular/core';

// ── httpResource() ────────────────────────────────────────
// Reactive HTTP — refetches automatically when signals change
selectedUserId = signal(1);

userResource = httpResource<User>(
  () => \`/api/users/\${this.selectedUserId()}\`
);

// Reactive state — no subscribe(), no takeUntil(), no cleanup:
userResource.value()       // User | undefined
userResource.status()      // 'idle' | 'loading' | 'resolved' | 'error'
userResource.isLoading()   // boolean
userResource.error()       // unknown
userResource.reload()      // manually trigger a re-fetch

// ── resource() ───────────────────────────────────────────
// Generic async resource with any loader (fetch, DB, WebSocket...)
commentResource = resource<Comment[], number>({
  params: () => this.postId(),          // reactive signal ← renamed from "request"
  loader: ({ params: id, abortSignal }) =>
    fetch(\`/api/comments?postId=\${id}\`, { signal: abortSignal })
      .then(r => r.json())              // abortSignal cancels on params change
});

// Same reactive API: .value(), .status(), .isLoading(), .reload()`;
}
