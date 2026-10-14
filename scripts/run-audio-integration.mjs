#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const modules = path.join(root, 'skills/reel/template/node_modules/@remotion');
let executable = process.env.FFMPEG_BIN;
if (!executable && fs.existsSync(modules)) {
  for (const name of fs.readdirSync(modules).filter(n => n.startsWith('compositor-'))) {
    const candidate = path.join(modules, name, process.platform === 'win32' ? 'ffmpeg.exe' : 'ffmpeg');
    if (fs.existsSync(candidate) && spawnSync(candidate, ['-version'], { stdio: 'ignore' }).status === 0) { executable = candidate; break; }
  }
}
if (!executable) {
  console.error('Defina FFMPEG_BIN ou instale as dependências do template Remotion para executar o teste real.');
  process.exit(1);
}
const result = spawnSync(process.execPath, ['--test', path.join(root, 'tests/audio-integration.test.mjs')], {
  cwd: root, stdio: 'inherit', env: { ...process.env, FFMPEG_BIN: executable },
});
process.exit(result.status ?? 1);
