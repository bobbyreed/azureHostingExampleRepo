import { Component, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

interface McpToolProperty {
  type: string;
  description?: string;
  enum?: string[];
}

interface McpTool {
  name: string;
  description: string;
  inputSchema: {
    type: string;
    properties?: Record<string, McpToolProperty>;
    required?: string[];
  };
}

interface LogEntry {
  direction: 'outgoing' | 'incoming' | 'error';
  label: string;
  body: unknown;
  timestamp: string;
}

@Component({
  selector: 'app-mcp-client',
  standalone: true,
  imports: [FormsModule, JsonPipe],
  templateUrl: './mcp-client.component.html',
})
export class McpClientComponent {
  private http = inject(HttpClient);
  private idCounter = 0;

  // ── Config ─────────────────────────────────────────────────────────────────
  serverUrl = 'http://localhost:3001/mcp';

  // ── State signals ───────────────────────────────────────────────────────────
  sessionId   = signal<string | null>(null);
  connected   = signal(false);
  loading     = signal(false);
  tools       = signal<McpTool[]>([]);
  log         = signal<LogEntry[]>([]);

  // ── Tool invocation state ───────────────────────────────────────────────────
  selectedTool = signal<McpTool | null>(null);
  toolInputs: Record<string, string> = {};
  toolResult   = signal<string | null>(null);

  // ── Helpers ─────────────────────────────────────────────────────────────────
  private nextId() { return ++this.idCounter; }

  private sessionHeaders(sid?: string | null): Record<string, string> {
    const h: Record<string, string> = { 'Content-Type': 'application/json' };
    if (sid) h['Mcp-Session-Id'] = sid;
    return h;
  }

  private addLog(entry: Omit<LogEntry, 'timestamp'>) {
    this.log.update(l => [
      ...l,
      { ...entry, timestamp: new Date().toLocaleTimeString() },
    ]);
  }

  private async post(body: unknown, sid?: string | null) {
    return firstValueFrom(
      this.http.post(this.serverUrl, body, {
        headers: this.sessionHeaders(sid),
        observe: 'response',
      }),
    );
  }

  // ── Connection flow ──────────────────────────────────────────────────────────
  async connect() {
    if (this.loading()) return;
    this.loading.set(true);
    this.log.set([]);
    this.connected.set(false);
    this.sessionId.set(null);
    this.tools.set([]);
    this.selectedTool.set(null);
    this.toolResult.set(null);

    try {
      // Step 1 — initialize (establish session)
      const initMsg = {
        jsonrpc: '2.0',
        method: 'initialize',
        params: {
          protocolVersion: '2024-11-05',
          capabilities: {},
          clientInfo: { name: 'angular-mcp-demo', version: '1.0.0' },
        },
        id: this.nextId(),
      };
      this.addLog({ direction: 'outgoing', label: 'initialize', body: initMsg });

      const initResp = await this.post(initMsg);
      const sid = initResp.headers.get('mcp-session-id');
      this.sessionId.set(sid);
      this.addLog({ direction: 'incoming', label: 'initialize → result', body: initResp.body });

      // Step 2 — notifications/initialized (required handshake notification)
      const notifMsg = { jsonrpc: '2.0', method: 'notifications/initialized' };
      this.addLog({ direction: 'outgoing', label: 'notifications/initialized', body: notifMsg });
      await this.post(notifMsg, sid);

      // Step 3 — tools/list (discover available tools)
      const listMsg = { jsonrpc: '2.0', method: 'tools/list', params: {}, id: this.nextId() };
      this.addLog({ direction: 'outgoing', label: 'tools/list', body: listMsg });

      const listResp = await this.post(listMsg, sid);
      this.addLog({ direction: 'incoming', label: 'tools/list → result', body: listResp.body });

      const discoveredTools: McpTool[] = (listResp.body as any)?.result?.tools ?? [];
      this.tools.set(discoveredTools);
      this.connected.set(true);

    } catch (err: any) {
      const msg = err?.message ?? String(err);
      this.addLog({ direction: 'error', label: 'Connection failed', body: msg });
    } finally {
      this.loading.set(false);
    }
  }

  // ── Tool selection ────────────────────────────────────────────────────────────
  selectTool(tool: McpTool) {
    this.selectedTool.set(tool);
    this.toolResult.set(null);

    // Pre-fill sensible defaults from schema
    this.toolInputs = {};
    for (const [key, schema] of Object.entries(tool.inputSchema?.properties ?? {})) {
      if (schema.enum?.length) {
        this.toolInputs[key] = schema.enum[0];
      } else if (schema.type === 'number') {
        this.toolInputs[key] = '1';
      } else {
        this.toolInputs[key] = '';
      }
    }
  }

  toolProperties(tool: McpTool): { key: string; schema: McpToolProperty }[] {
    return Object.entries(tool.inputSchema?.properties ?? {})
      .map(([key, schema]) => ({ key, schema }));
  }

  hasInputs(tool: McpTool): boolean {
    return Object.keys(tool.inputSchema?.properties ?? {}).length > 0;
  }

  // ── Tool invocation ───────────────────────────────────────────────────────────
  async runTool() {
    const tool = this.selectedTool();
    if (!tool || this.loading()) return;
    this.loading.set(true);
    this.toolResult.set(null);

    // Cast inputs to their correct types
    const args: Record<string, unknown> = {};
    for (const { key, schema } of this.toolProperties(tool)) {
      args[key] = schema.type === 'number'
        ? parseFloat(this.toolInputs[key] ?? '0')
        : this.toolInputs[key] ?? '';
    }

    const callMsg = {
      jsonrpc: '2.0',
      method: 'tools/call',
      params: { name: tool.name, arguments: args },
      id: this.nextId(),
    };
    this.addLog({ direction: 'outgoing', label: `tools/call → ${tool.name}`, body: callMsg });

    try {
      const resp = await this.post(callMsg, this.sessionId());
      this.addLog({ direction: 'incoming', label: `${tool.name} → result`, body: resp.body });
      const text = (resp.body as any)?.result?.content?.[0]?.text ?? JSON.stringify(resp.body, null, 2);
      this.toolResult.set(text);
    } catch (err: any) {
      const msg = err?.message ?? String(err);
      this.addLog({ direction: 'error', label: `${tool.name} failed`, body: msg });
      this.toolResult.set('Error: ' + msg);
    } finally {
      this.loading.set(false);
    }
  }

  clearLog() { this.log.set([]); }

  disconnect() {
    const sid = this.sessionId();
    if (sid) {
      // Fire-and-forget DELETE to close the session on the server
      this.http.delete(this.serverUrl, { headers: this.sessionHeaders(sid) }).subscribe();
    }
    this.connected.set(false);
    this.sessionId.set(null);
    this.tools.set([]);
    this.selectedTool.set(null);
    this.toolResult.set(null);
    this.log.set([]);
  }

  // ── Code snippet ──────────────────────────────────────────────────────────────
  readonly code = `// mcp-client.service.ts  (simplified)
import { inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class McpClientService {
  private http = inject(HttpClient);
  private idCounter = 0;

  sessionId  = signal<string | null>(null);
  connected  = signal(false);
  tools      = signal<McpTool[]>([]);

  async connect(serverUrl: string) {
    // ① Initialize — server responds with its capabilities + session ID header
    const initResp = await firstValueFrom(
      this.http.post(serverUrl, {
        jsonrpc: '2.0', method: 'initialize', id: ++this.idCounter,
        params: { protocolVersion: '2024-11-05', capabilities: {},
                  clientInfo: { name: 'my-client', version: '1.0.0' } },
      }, { observe: 'response' })
    );
    const sid = initResp.headers.get('mcp-session-id');
    this.sessionId.set(sid);

    // ② Send required handshake notification (no response expected)
    await firstValueFrom(
      this.http.post(serverUrl,
        { jsonrpc: '2.0', method: 'notifications/initialized' },
        { headers: { 'Mcp-Session-Id': sid! } }
      )
    );

    // ③ Discover tools
    const listResp = await firstValueFrom(
      this.http.post(serverUrl,
        { jsonrpc: '2.0', method: 'tools/list', params: {}, id: ++this.idCounter },
        { headers: { 'Mcp-Session-Id': sid! } }
      )
    );
    this.tools.set((listResp as any).result.tools);
    this.connected.set(true);
  }

  async callTool(serverUrl: string, name: string, args: Record<string, unknown>) {
    const resp = await firstValueFrom(
      this.http.post(serverUrl, {
        jsonrpc: '2.0', method: 'tools/call', id: ++this.idCounter,
        params: { name, arguments: args },
      }, { headers: { 'Mcp-Session-Id': this.sessionId()! } })
    );
    // Result text lives at: resp.result.content[0].text
    return (resp as any).result.content[0].text as string;
  }
}`;
}
