#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';

export function validateSkill(folder) {
  const errors = [];
  const file = path.join(folder, 'SKILL.md');
  if (!fs.existsSync(file)) return ['Falta SKILL.md'];
  const text = fs.readFileSync(file, 'utf8');
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) return ['Frontmatter YAML ausente ou não delimitado'];
  let meta;
  try { meta = YAML.parse(match[1], { uniqueKeys: true }); }
  catch (e) { return [`YAML inválido: ${e.message}`]; }
  if (!meta || typeof meta !== 'object' || Array.isArray(meta)) return ['Frontmatter deve ser um mapa'];
  if (typeof meta.name !== 'string' || meta.name.length > 64 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(meta.name)) errors.push('name inválido');
  if (meta.name !== path.basename(folder)) errors.push('name diferente do nome da pasta');
  if (typeof meta.description !== 'string' || !meta.description.trim() || meta.description.length > 1024) errors.push('description deve ter 1 a 1024 caracteres');
  if (!text.slice(match[0].length).trim()) errors.push('Corpo vazio');
  for (const link of text.matchAll(/\]\(([^)]+)\)/g)) {
    const target = link[1];
    if (/^(?:[a-z]+:|#)/i.test(target)) continue;
    if (!fs.existsSync(path.resolve(folder, target.split('#')[0]))) errors.push(`Recurso ausente: ${target}`);
  }
  return errors;
}

export function validateDirectory(root) {
  const names = fs.readdirSync(root).filter(n => fs.statSync(path.join(root, n)).isDirectory()).sort();
  return names.map(name => ({ name, errors: validateSkill(path.join(root, name)) }));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = process.argv[2] ? path.resolve(process.argv[2]) : path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../skills');
  try {
    const results = validateDirectory(root);
    if (!results.length) throw new Error('Nenhuma skill encontrada');
    for (const r of results) console.log(`${r.errors.length ? 'ERRO' : 'OK'} ${r.name}${r.errors.length ? ': ' + r.errors.join('; ') : ''}`);
    process.exitCode = results.some(r => r.errors.length) ? 1 : 0;
  } catch (e) { console.error(e.message); process.exitCode = 1; }
}
