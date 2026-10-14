#!/usr/bin/env node
// Copia pacotes completos; não executa código das skills nem sobrescreve instalações.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const source = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../skills');
const available = fs.readdirSync(source).filter(n => fs.existsSync(path.join(source, n, 'SKILL.md'))).sort();
const args = process.argv.slice(2);
let dest, dryRun = false, selected = [];
try {
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--dry-run') dryRun = true;
    else if (arg === '--user') {
      if (dest) throw new Error('Escolha um único destino.');
      dest = path.join(os.homedir(), '.agents', 'skills');
    } else if (arg === '--dest') {
      if (dest || !args[i + 1] || args[i + 1].startsWith('--')) throw new Error('--dest exige um único caminho.');
      dest = path.resolve(args[++i]);
    } else if (arg === '--skill') {
      const name = args[++i];
      if (!available.includes(name)) throw new Error(`Skill desconhecida: ${name}. Disponíveis: ${available.join(', ')}`);
      selected.push(name);
    } else throw new Error(`Opção desconhecida: ${arg}`);
  }
  if (!dest) throw new Error('Uso: node scripts/install-skills.mjs --dest <projeto/.agents/skills> | --user [--skill nome] [--dry-run]');
  selected = [...new Set(selected.length ? selected : available)];
  // Planejar todas as cópias antes de modificar o destino.
  for (const name of selected) {
    const target = path.join(dest, name);
    if (fs.existsSync(target) || (() => { try { fs.lstatSync(target); return true; } catch { return false; } })()) {
      throw new Error(`Destino já existe: ${target}. Nenhum arquivo foi copiado. Escolha outra pasta ou preserve/remova manualmente a instalação anterior.`);
    }
  }
  const resolvedDest = fs.existsSync(dest) ? fs.realpathSync(dest) : dest;
  if (resolvedDest === source || resolvedDest.startsWith(source + path.sep)) throw new Error('O destino não pode ficar dentro das skills de origem.');
  for (const name of selected) {
    const target = path.join(dest, name);
    if (!dryRun) fs.cpSync(path.join(source, name), target, {
      recursive: true, errorOnExist: true, force: false,
      filter: p => !['node_modules', 'out', '.env', '.git', '__pycache__'].includes(path.basename(p)),
    });
    console.log(`${dryRun ? 'Planejado' : 'Instalado'}: ${name} -> ${target}`);
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
