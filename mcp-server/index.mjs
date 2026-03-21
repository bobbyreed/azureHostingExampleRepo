/**
 * Angular MCP Demo Server
 *
 * Implements the MCP protocol (JSON-RPC 2.0 over HTTP POST) without SSE so
 * the Angular HttpClient can talk to it with zero special handling.
 *
 * MCP spec reference: https://spec.modelcontextprotocol.io/
 *
 * Run:  npm install && npm start
 * Port: 3001  (set PORT env var to override)
 */

import express from 'express';
import cors from 'cors';
import { randomUUID } from 'crypto';

const app = express();

app.use(cors({
  origin: '*',
  exposedHeaders: ['Mcp-Session-Id'],   // Angular needs to read this header
}));
app.use(express.json());

// ── Session store ────────────────────────────────────────────────────────────
// In production you would use Redis or a DB; Map is fine for a demo.
const sessions = new Map();

// ── Tool definitions ─────────────────────────────────────────────────────────
const TOOLS = [
  {
    name: 'echo',
    description: 'Echo a message back to the caller.',
    inputSchema: {
      type: 'object',
      properties: {
        message: { type: 'string', description: 'The text to echo' },
      },
      required: ['message'],
    },
  },
  {
    name: 'get_time',
    description: 'Return the current server time as an ISO-8601 string.',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'calculate',
    description: 'Perform basic arithmetic on two numbers.',
    inputSchema: {
      type: 'object',
      properties: {
        operation: {
          type: 'string',
          enum: ['add', 'subtract', 'multiply', 'divide'],
          description: 'The arithmetic operation to apply',
        },
        a: { type: 'number', description: 'First operand' },
        b: { type: 'number', description: 'Second operand' },
      },
      required: ['operation', 'a', 'b'],
    },
  },
  {
    name: 'list_demos',
    description: 'List the Angular feature pages available in this showcase.',
    inputSchema: { type: 'object', properties: {} },
  },
];

// ── Tool executor ─────────────────────────────────────────────────────────────
function executeTool(name, args) {
  switch (name) {
    case 'echo':
      return { content: [{ type: 'text', text: `Echo: ${args.message}` }] };

    case 'get_time':
      return { content: [{ type: 'text', text: new Date().toISOString() }] };

    case 'calculate': {
      const { operation, a, b } = args;
      let result;
      switch (operation) {
        case 'add':      result = a + b; break;
        case 'subtract': result = a - b; break;
        case 'multiply': result = a * b; break;
        case 'divide':
          result = b !== 0 ? a / b : 'Error: division by zero';
          break;
      }
      return {
        content: [{ type: 'text', text: `${a} ${operation} ${b} = ${result}` }],
      };
    }

    case 'list_demos':
      return {
        content: [{
          type: 'text',
          text: JSON.stringify([
            'Components', 'Directives', 'Forms', 'Pipes', 'Services',
            'HTTP Client', 'Signals', 'Lifecycle', 'RxJS',
            'Signal I/O', 'linkedSignal', 'httpResource',
            'Zoneless', 'Signal Forms', 'MCP Client',
          ], null, 2),
        }],
      };

    default:
      throw { code: -32601, message: `Unknown tool: ${name}` };
  }
}

// ── MCP endpoint ─────────────────────────────────────────────────────────────
app.post('/mcp', (req, res) => {
  const msg = req.body;

  // Resolve or create a session
  let sessionId = req.headers['mcp-session-id'];
  if (!sessionId || !sessions.has(sessionId)) {
    sessionId = randomUUID();
    sessions.set(sessionId, { createdAt: Date.now() });
    console.log(`[MCP] New session: ${sessionId}`);
  }

  res.setHeader('Mcp-Session-Id', sessionId);
  res.setHeader('Content-Type', 'application/json');

  // MCP notifications have no `id` — acknowledge and return.
  if (msg.id === undefined && msg.method) {
    console.log(`[MCP] Notification: ${msg.method}`);
    return res.status(202).json({});
  }

  console.log(`[MCP] Request ${msg.id}: ${msg.method}`);

  try {
    switch (msg.method) {
      // ── Handshake ─────────────────────────────────────────────────────────
      case 'initialize':
        return res.json({
          jsonrpc: '2.0',
          result: {
            protocolVersion: '2024-11-05',
            capabilities: { tools: {} },
            serverInfo: { name: 'angular-mcp-demo', version: '1.0.0' },
          },
          id: msg.id,
        });

      // ── Tool discovery ────────────────────────────────────────────────────
      case 'tools/list':
        return res.json({
          jsonrpc: '2.0',
          result: { tools: TOOLS },
          id: msg.id,
        });

      // ── Tool invocation ───────────────────────────────────────────────────
      case 'tools/call': {
        const { name, arguments: args } = msg.params;
        const result = executeTool(name, args ?? {});
        return res.json({ jsonrpc: '2.0', result, id: msg.id });
      }

      default:
        return res.json({
          jsonrpc: '2.0',
          error: { code: -32601, message: `Method not found: ${msg.method}` },
          id: msg.id,
        });
    }
  } catch (err) {
    return res.json({
      jsonrpc: '2.0',
      error: { code: err.code ?? -32000, message: err.message },
      id: msg.id,
    });
  }
});

// ── Session teardown ─────────────────────────────────────────────────────────
app.delete('/mcp', (req, res) => {
  const sessionId = req.headers['mcp-session-id'];
  if (sessionId && sessions.has(sessionId)) {
    sessions.delete(sessionId);
    console.log(`[MCP] Session closed: ${sessionId}`);
  }
  res.status(200).end();
});

// ── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT ?? 3001;
app.listen(PORT, () => {
  console.log(`MCP demo server listening on http://localhost:${PORT}`);
  console.log(`Tools available: ${TOOLS.map(t => t.name).join(', ')}`);
});
