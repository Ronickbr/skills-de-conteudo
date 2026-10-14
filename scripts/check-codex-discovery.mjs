#!/usr/bin/env node
// Smoke test de descoberta real, sem iniciar conversa ou chamar um modelo.
import { spawn } from 'node:child_process';
import readline from 'node:readline';
import path from 'node:path';

const cwd = path.resolve(process.argv[2] ?? '.');
const executable = process.argv[3] ?? 'codex';
const expected = ['carrossel', 'comentarios', 'legenda', 'perfil', 'reel'];
const installed = path.join(cwd, '.agents', 'skills');
const normalize = p => p.replaceAll('\\', '/').toLowerCase();
const proc = spawn(executable, ['app-server'], { cwd, stdio: ['pipe', 'pipe', 'pipe'] });
const lines = readline.createInterface({ input: proc.stdout });
let completed = false;
const finish = (code, message) => {
  if (completed) return;
  completed = true;
  console.log(message);
  clearTimeout(timer);
  lines.close(); proc.stdin.end(); proc.kill(); process.exitCode = code;
};
const timer = setTimeout(() => finish(1, 'Timeout: não foi possível confirmar descoberta no app-server.'), 30000);
const send = message => proc.stdin.write(JSON.stringify(message) + '\n');
proc.on('error', e => finish(1, `Não foi possível iniciar Codex: ${e.code}`));
proc.stderr.on('data', () => {}); // Descartar logs globais alheios a este teste.
proc.on('exit', code => { if (!completed) finish(1, `Codex encerrou antes da resposta (${code}).`); });
lines.on('line', line => {
  let msg;
  try { msg = JSON.parse(line); } catch { return; }
  if (msg.id === 0) {
    if (msg.error) return finish(1, `initialize: ${msg.error.message}`);
    send({ method: 'initialized', params: {} });
    send({ method: 'skills/list', id: 1, params: { cwds: [cwd], forceReload: true } });
  }
  if (msg.id === 1) {
    if (msg.error) return finish(1, `skills/list: ${msg.error.message}`);
    const data = msg.result?.data ?? [];
    const ours = data.flatMap(d => d.skills ?? []).filter(s => s.path && normalize(s.path).startsWith(normalize(installed) + '/'));
    const missing = expected.filter(name => !ours.some(s => s.name === name && s.enabled !== false));
    const errors = data.flatMap(d => d.errors ?? []).filter(e => JSON.stringify(e).toLowerCase().includes(normalize(installed)));
    finish(missing.length || errors.length ? 1 : 0, JSON.stringify({ found: ours.map(s => ({ name: s.name, enabled: s.enabled, path: s.path })), missing, errors }, null, 2));
  }
});
send({ method: 'initialize', id: 0, params: { clientInfo: { name: 'skills_conteudo_validation', version: '1.0.0' } } });
