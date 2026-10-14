import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';
import { validateDirectory, validateSkill } from '../scripts/validate-skills.mjs';
import { validar, validarTempos, estimarTempos } from '../skills/reel/scripts/_comum.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const run = (script, args = [], extra = {}) => spawnSync(process.execPath, [path.join(root, script), ...args], { cwd: root, encoding: 'utf8', ...extra });
const temp = t => { const p = fs.mkdtempSync(path.join(os.tmpdir(), 'skills-conteudo-')); t.after(() => fs.rmSync(p, { recursive: true, force: true })); return p; };
const example = () => JSON.parse(fs.readFileSync(path.join(root, 'skills/reel/exemplos/cenas.exemplo.json'), 'utf8'));

test('todos os pacotes têm frontmatter e corpo válidos', () => {
  const results = validateDirectory(path.join(root, 'skills'));
  assert.equal(results.length, 5);
  for (const r of results) assert.deepEqual(r.errors, [], r.name);
});

test('validator rejeita YAML duplicado, nome inválido e recurso ausente', t => {
  const folder = path.join(temp(t), 'teste'); fs.mkdirSync(folder);
  const write = s => fs.writeFileSync(path.join(folder, 'SKILL.md'), s);
  write('---\nname: teste\nname: teste\ndescription: Teste\n---\nCorpo');
  assert.ok(validateSkill(folder).some(e => e.includes('YAML')));
  write('---\nname: Outro\ndescription: Teste\n---\n[Referência](references/falta.md)');
  assert.ok(validateSkill(folder).some(e => e.includes('name')));
  assert.ok(validateSkill(folder).some(e => e.includes('ausente')));
});

test('instalação copia as cinco skills e recursos ocultos sem dependências locais', t => {
  const dest = path.join(temp(t), 'projeto com espaços', '.agents', 'skills');
  const result = run('scripts/install-skills.mjs', ['--dest', dest]);
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(validateDirectory(dest).map(r => r.errors), [[], [], [], [], []]);
  for (const resource of ['reel/.env.exemplo', 'reel/template/package-lock.json', 'reel/scripts/_comum.mjs', 'carrossel/templates/carrossel.html', 'carrossel/package-lock.json']) assert.ok(fs.existsSync(path.join(dest, resource)), resource);
  assert.equal(fs.existsSync(path.join(dest, 'reel/template/node_modules')), false);
  fs.writeFileSync(path.join(dest, 'legenda', 'preservar.txt'), 'original');
  const repeat = run('scripts/install-skills.mjs', ['--dest', dest]);
  assert.equal(repeat.status, 1);
  assert.equal(fs.readFileSync(path.join(dest, 'legenda/preservar.txt'), 'utf8'), 'original');
});

test('dry-run não cria destino; seleção desconhecida não grava; colisão não copia parcialmente', t => {
  const dest = path.join(temp(t), 'skills');
  assert.equal(run('scripts/install-skills.mjs', ['--dest', dest, '--dry-run']).status, 0);
  assert.equal(fs.existsSync(dest), false);
  assert.equal(run('scripts/install-skills.mjs', ['--dest', dest, '--skill', '../reel']).status, 1);
  fs.mkdirSync(path.join(dest, 'reel'), { recursive: true });
  assert.equal(run('scripts/install-skills.mjs', ['--dest', dest]).status, 1);
  assert.equal(fs.existsSync(path.join(dest, 'carrossel')), false);
});

test('instalação seletiva funciona a partir de outro diretório', t => {
  const cwd = temp(t), dest = path.join(cwd, '.agents/skills');
  assert.equal(run('scripts/install-skills.mjs', ['--dest', dest, '--skill', 'legenda'], { cwd }).status, 0);
  assert.deepEqual(fs.readdirSync(dest), ['legenda']);
});

test('validação de cenas rejeita entradas que quebrariam render e paths fora de public', () => {
  assert.deepEqual(validar(example()), []);
  for (const value of [null, [], {}, { cenas: [null] }]) assert.ok(validar(value).length);
  const d = example(); d.cenas[0].duracao = Infinity; d.narracao = '../secreto.mp3'; d.cores = { texto: 'red' };
  assert.ok(validar(d).length >= 3);
  const n = example(); n.cenas.push({ tipo: 'numero', fala: 'Número', ate: 1, decimais: 100 });
  assert.ok(validar(n).length);
});

test('timing detecta fala alterada com mesma quantidade de cenas', () => {
  const d = example(), times = estimarTempos(d.cenas);
  assert.deepEqual(validarTempos(times, d.cenas), []);
  d.cenas[0].fala = 'Outra fala completamente diferente';
  assert.ok(validarTempos(times, d.cenas).some(e => e.includes('mudou')));
  assert.ok(validarTempos({}, d.cenas).length);
});

test('checagem e simulação executam sem chave ou rede; timing inválido dá erro legível', t => {
  const project = temp(t); fs.mkdirSync(path.join(project, 'public'));
  const d = example(); fs.writeFileSync(path.join(project, 'cenas.json'), JSON.stringify(d));
  const stub = path.join(project, 'no-network.mjs');
  fs.writeFileSync(stub, "globalThis.fetch = () => { throw new Error('REDE PROIBIDA NO TESTE'); };\n");
  const simulated = spawnSync(process.execPath, ['--import', pathToFileURL(stub).href, path.join(root, 'skills/reel/scripts/narrar.mjs'), '--projeto', project, '--simular'], { encoding: 'utf8', env: { ...process.env, ELEVENLABS_API_KEY: '' } });
  assert.equal(simulated.status, 0, simulated.stderr);
  assert.match(simulated.stdout, /nada foi enviado/);
  assert.equal(run('skills/reel/scripts/checar.mjs', ['--projeto', project]).status, 0);
  d.palavras = 'palavras.json'; fs.writeFileSync(path.join(project, 'cenas.json'), JSON.stringify(d));
  fs.writeFileSync(path.join(project, 'public/palavras.json'), '{}');
  const checked = run('skills/reel/scripts/checar.mjs', ['--projeto', project]);
  assert.equal(checked.status, 1); assert.match(checked.stdout, /inválido/); assert.doesNotMatch(checked.stderr, /TypeError/);
});

test('narração simulada gera arquivos e cache evita segunda chamada à API', t => {
  const project = temp(t), d = example();
  fs.writeFileSync(path.join(project, 'cenas.json'), JSON.stringify(d));
  const stub = path.join(project, 'fake-api.mjs');
  fs.writeFileSync(stub, `globalThis.fetch = async (url, init) => {
    if (!url.startsWith('https://api.elevenlabs.io/v1/text-to-speech/')) throw new Error('URL inesperada');
    if (init.headers['xi-api-key'] !== 'fake-test-key') throw new Error('Chave inesperada');
    const {text} = JSON.parse(init.body);
    const characters = [...text];
    return new Response(JSON.stringify({audio_base64: Buffer.from('fake audio; not a real MP3').toString('base64'), alignment: {characters, character_start_times_seconds: characters.map((_, i) => i * 0.06), character_end_times_seconds: characters.map((_, i) => (i + 1) * 0.06)}}));
  };`);
  const args = ['--import', pathToFileURL(stub).href, path.join(root, 'skills/reel/scripts/narrar.mjs'), '--projeto', project];
  const env = { ...process.env, ELEVENLABS_API_KEY: 'fake-test-key', ELEVENLABS_VOICE_ID: 'fake-voice' };
  const first = spawnSync(process.execPath, args, { cwd: project, encoding: 'utf8', env });
  assert.equal(first.status, 0, first.stderr);
  assert.doesNotMatch(first.stdout + first.stderr, /fake-test-key/);
  const times = JSON.parse(fs.readFileSync(path.join(project, 'public/palavras.json')));
  assert.deepEqual(validarTempos(times, d.cenas), []);
  fs.writeFileSync(stub, "globalThis.fetch = () => { throw new Error('NÃO DEVERIA CHAMAR API'); };\n");
  fs.writeFileSync(path.join(project, 'cenas.json'), JSON.stringify(d)); // restaurar exemplo sem paths de áudio
  const cached = spawnSync(process.execPath, args, { cwd: project, encoding: 'utf8', env });
  assert.equal(cached.status, 0, cached.stderr); assert.match(cached.stdout, /nenhum crédito gasto/);
  assert.equal(JSON.parse(fs.readFileSync(path.join(project, 'cenas.json'))).narracao, 'narracao.mp3');
});

test('erros da API não expõem o corpo nem gravam narração incompleta', t => {
  const project = temp(t);
  fs.writeFileSync(path.join(project, 'cenas.json'), JSON.stringify(example()));
  const stub = path.join(project, 'api-error.mjs');
  const args = ['--import', pathToFileURL(stub).href, path.join(root, 'skills/reel/scripts/narrar.mjs'), '--projeto', project];
  const env = { ...process.env, ELEVENLABS_API_KEY: 'fake-test-key' };
  fs.writeFileSync(stub, "globalThis.fetch = async () => new Response('fake-test-key', {status: 401});");
  const denied = spawnSync(process.execPath, args, { encoding: 'utf8', env });
  assert.equal(denied.status, 1); assert.match(denied.stderr, /401/); assert.doesNotMatch(denied.stderr, /fake-test-key/);
  fs.writeFileSync(stub, "globalThis.fetch = async () => new Response(JSON.stringify({audio_base64:'YWJj',alignment:{characters:['a']}}));");
  const invalid = spawnSync(process.execPath, args, { encoding: 'utf8', env });
  assert.equal(invalid.status, 1); assert.match(invalid.stderr, /alinhamento incompleto/);
  assert.equal(fs.existsSync(path.join(project, 'public/narracao.mp3')), false);
  fs.writeFileSync(stub, "globalThis.fetch = async () => { throw new TypeError('fetch failed', {cause: {code: 'EACCES'}}); };");
  const network = spawnSync(process.execPath, args, { encoding: 'utf8', env });
  assert.equal(network.status, 1); assert.match(network.stderr, /EACCES/); assert.doesNotMatch(network.stderr, /fake-test-key/);
});

test('mixagem sem ffmpeg copia trilha, atualiza JSON e permite remover', t => {
  const project = temp(t);
  fs.writeFileSync(path.join(project, 'cenas.json'), JSON.stringify(example()));
  const music = path.join(project, 'entrada.mp3'); fs.writeFileSync(music, 'fake audio');
  const env = { ...process.env, PATH: '' };
  const mixed = run('skills/reel/scripts/mixar.mjs', [music, '--projeto', project], { env });
  assert.equal(mixed.status, 0, mixed.stderr);
  assert.equal(fs.readFileSync(path.join(project, 'public/trilha.mp3'), 'utf8'), 'fake audio');
  assert.equal(JSON.parse(fs.readFileSync(path.join(project, 'cenas.json'))).trilha, 'trilha.mp3');
  assert.equal(run('skills/reel/scripts/mixar.mjs', ['--remover', '--projeto', project]).status, 0);
  assert.equal(JSON.parse(fs.readFileSync(path.join(project, 'cenas.json'))).trilha, null);
  assert.equal(run('skills/reel/scripts/mixar.mjs', [music, '--projeto', project, '--inicio', '-1'], { env }).status, 1);
});

test('exportador rejeita escala inválida antes de iniciar navegador', () => {
  const result = run('skills/carrossel/scripts/exportar.mjs', ['arquivo.html', '--escala', '0']);
  assert.equal(result.status, 1); assert.match(result.stderr, /positivo/);
});
