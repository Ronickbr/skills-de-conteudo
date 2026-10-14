import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ffmpeg = process.env.FFMPEG_BIN;
const run = (exe, args) => {
  const r = spawnSync(exe, args, { encoding: null, maxBuffer: 8 * 1024 * 1024 });
  assert.equal(r.status, 0, r.stderr?.toString());
  return r.stdout;
};
const wave = () => {
  const rate = 44100, seconds = 2, data = Buffer.alloc(rate * seconds * 2);
  for (let i = 0; i < rate * seconds; i++) data.writeInt16LE(Math.round(12000 * Math.sin(2 * Math.PI * 440 * i / rate)), i * 2);
  const header = Buffer.alloc(44);
  header.write('RIFF'); header.writeUInt32LE(data.length + 36, 4); header.write('WAVEfmt ', 8);
  header.writeUInt32LE(16, 16); header.writeUInt16LE(1, 20); header.writeUInt16LE(1, 22);
  header.writeUInt32LE(rate, 24); header.writeUInt32LE(rate * 2, 28); header.writeUInt16LE(2, 32); header.writeUInt16LE(16, 34);
  header.write('data', 36); header.writeUInt32LE(data.length, 40);
  return Buffer.concat([header, data]);
};

test('ffmpeg real normaliza, repete entrada curta, corta, aplica fades e gera MP3 estéreo', { skip: !ffmpeg }, t => {
  const project = process.env.AUDIO_TEST_OUTPUT ? path.resolve(process.env.AUDIO_TEST_OUTPUT) : fs.mkdtempSync(path.join(os.tmpdir(), 'conteudo-audio-'));
  fs.mkdirSync(project, { recursive: true });
  if (!process.env.AUDIO_TEST_OUTPUT) t.after(() => fs.rmSync(project, { recursive: true, force: true }));
  const d = { cenas: [
    { tipo: 'gancho', titulo: 'Planeje sua semana', fala: 'Planeje sua semana', duracao: 2 },
    { tipo: 'cta', palavra: 'PLANO', fala: 'Comenta PLANO', duracao: 3 },
  ] };
  const source = path.join(project, 'tom.wav'), music = path.join(project, 'entrada.mp3');
  fs.writeFileSync(source, wave()); fs.writeFileSync(path.join(project, 'cenas.json'), JSON.stringify(d));
  run(ffmpeg, ['-v', 'error', '-y', '-i', source, '-ac', '2', '-b:a', '192k', music]);
  run(process.execPath, [path.join(root, 'skills/reel/scripts/mixar.mjs'), music, '--projeto', project, '--ffmpeg', ffmpeg, '--inicio', '0.25']);
  const out = path.join(project, 'public/trilha.mp3');
  assert.equal(JSON.parse(fs.readFileSync(path.join(project, 'cenas.json'))).trilha, 'trilha.mp3');
  const decoded = run(ffmpeg, ['-v', 'error', '-i', out, '-f', 'wav', '-acodec', 'pcm_s16le', '-ar', '44100', '-ac', '2', 'pipe:1']);
  let offset = 12, pcm;
  while (offset + 8 <= decoded.length) {
    const id = decoded.toString('ascii', offset, offset + 4), size = decoded.readUInt32LE(offset + 4);
    if (id === 'data') { pcm = decoded.subarray(offset + 8); break; }
    offset += 8 + size + (size % 2);
  }
  assert.ok(pcm, 'WAV decodificado sem dados PCM');
  const duration = pcm.length / (44100 * 2 * 2);
  assert.ok(Math.abs(duration - 5.5) < 0.1, `Duração incorreta: ${duration}`);
  const rms = (from, to) => {
    let sum = 0, count = 0;
    for (let i = Math.floor(from * 44100) * 4; i < Math.min(pcm.length, Math.floor(to * 44100) * 4); i += 4) {
      sum += (pcm.readInt16LE(i) / 32768) ** 2; count++;
    }
    return Math.sqrt(sum / count);
  };
  const steady = rms(1, 2);
  assert.ok(steady > 0.005 && steady < 0.25, `RMS após normalização: ${steady}`);
  assert.ok(rms(0, 0.1) < steady * 0.4, 'Fade de entrada ausente');
  assert.ok(rms(5.35, 5.45) < steady * 0.2, 'Fade de saída ausente');
  assert.ok(rms(3, 4) > steady * 0.8, 'A entrada curta não foi repetida');
  const measured = spawnSync(ffmpeg, ['-hide_banner', '-i', out, '-af', 'loudnorm=I=-20:print_format=json', '-f', 'null', '-'], { encoding: 'utf8' });
  assert.equal(measured.status, 0, measured.stderr);
  const loudness = JSON.parse(measured.stderr.slice(measured.stderr.lastIndexOf('{'), measured.stderr.lastIndexOf('}') + 1));
  assert.ok(Math.abs(Number(loudness.input_i) + 20) < 2.5, `Loudness fora do alvo após fades: ${loudness.input_i} LUFS`);
  if (process.env.AUDIO_TEST_OUTPUT) fs.writeFileSync(path.join(project, 'metrics.json'), JSON.stringify({ duration, sampleRate: 44100, channels: 2, loudness: Number(loudness.input_i), rmsSteady: steady, rmsStart: rms(0, 0.1), rmsEnd: rms(5.35, 5.45) }, null, 2));
});
