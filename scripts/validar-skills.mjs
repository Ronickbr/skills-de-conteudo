#!/usr/bin/env node
// Validacao sem dependencias das cinco skills antes de instalar no Codex.
import {readFileSync, existsSync} from 'node:fs';
import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'skills');
const names = ['reel', 'carrossel', 'legenda', 'perfil', 'comentarios'];
let errors = 0;
for (const name of names) {
  const path = join(root, name, 'SKILL.md');
  if (!existsSync(path)) { console.error('ERRO: ausente', path); errors++; continue; }
  const content = readFileSync(path, 'utf8');
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!match) { console.error('ERRO: YAML frontmatter ausente:', name); errors++; continue; }
  const values = Object.fromEntries(match[1].split(/\r?\n/).map(line => {
    const m = line.match(/^([a-z][\w-]*):\s*(.*)$/);
    return m ? [m[1], m[2].trim()] : [null, null];
  }).filter(([key]) => key));
  for (const key of ['name', 'description']) {
    if (!values[key]) { console.error('ERRO: campo ausente:', name, key); errors++; }
  }
  if (values.name !== name) { console.error('ERRO: name difere da pasta:', name); errors++; }
  if ((values.description || '').length > 500) { console.error('ERRO: descricao acima de 500 caracteres:', name); errors++; }
  else if (values.name === name && values.description) console.log('OK:', name);
}
for (const path of [
  'reel/scripts/narrar.mjs', 'reel/scripts/checar.mjs',
  'reel/template/package.json', 'carrossel/scripts/exportar.mjs',
  'carrossel/templates/carrossel.html'
]) {
  if (!existsSync(join(root, path))) { console.error('ERRO: dependencia ausente:', path); errors++; }
}
if (errors) { console.error(errors + ' erro(s).'); process.exitCode = 1; }
else console.log('5 skills validas; arquivos auxiliares presentes.');
