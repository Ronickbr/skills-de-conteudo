#!/usr/bin/env node
// Executa prompts sem $nome, registra eventos completos e permite auditar seleção nativa.
// Não faz chamada ElevenLabs. Usa a autenticação/modelo já configurados no Codex local.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const codex = process.argv[2] ?? 'codex';
const out = path.join(root, '.validation/model-prompts');
fs.mkdirSync(out, { recursive: true });
const cases = [
  ['A', 'Escreva o texto que acompanha meu post no Instagram. Público: fotógrafos iniciantes. O post ensina a limpar a lente, usar luz de janela e apoiar o celular. Tom didático, sem emojis. Quero que salvem para consultar. Não tenho resultados numéricos para citar.'],
  ['B', 'Meu perfil atrai poucos clientes. Nome: Clara | fotografia de produtos. Bio: Fotos claras para lojas pequenas. Fotógrafa há 4 anos. Peça orçamento no link. Objetivo: orçamentos de pequenos lojistas. Não forneci link, destaques ou posts. Avalie o que puder e proponha três bios, sem inventar prova.'],
  ['C', 'Prepare respostas para os comentários do post sobre fotografar produtos com celular. CTA GUIA. Material: https://example.com/guia-fotos. Tom cordial. Comentários: @ana: GUIA; @bia: Obrigada, vou testar; @leo: Serve para doces?; @rui: Isso não funciona em quarto escuro; @spam: Ganhe seguidores no meu site; @caio: Vocês são idiotas. Quero tabela e CSV, não envie nada.'],
  ['D', 'Quero um post em seis imagens que ensine universitários a organizar uma semana de estudos: escolha as matérias, reserve blocos, faça pausas e revise. Meu objetivo é salvamento. Tom acolhedor, sem promessa de notas melhores. Entregue apenas a copy slide a slide e três opções de capa; não gere arquivos.'],
  ['E', 'Quero somente um roteiro isolado de vídeo de 25 segundos sobre planejar a semana. Público universitário, tom direto, CTA comentar PLANO. Não preciso de vídeo pronto, imagens ou arquivos.'],
  ['F', 'Crie e entregue um reel vertical tipográfico pronto em MP4 sobre planejar a semana. Público universitários, 25 segundos, tom direto, sem voz e sem música. CTA comentar PLANO para receber meu checklist.'],
];
const summary = [];
for (const [id, request] of cases) {
  const prompt = request + '\n\nCondições do ensaio: responda usando as capacidades pertinentes disponíveis. O ambiente é somente leitura; se impedir arquivos ou renderização, entregue o material textual que puder e registre o limite. Não leia .env ou credenciais, não chame APIs de narração e não publique ou envie mensagens. Não execute scripts deste ensaio.';
  fs.writeFileSync(path.join(out, `${id}-prompt.txt`), prompt);
  console.log(`Executando cenário ${id}...`);
  const r = spawnSync(codex, ['exec', '--ephemeral', '--sandbox', 'read-only', '--json', '--output-last-message', path.join(out, `${id}-response.md`), prompt], { cwd: root, encoding: 'utf8', timeout: 180000, maxBuffer: 16 * 1024 * 1024 });
  fs.writeFileSync(path.join(out, `${id}-events.jsonl`), r.stdout ?? '');
  fs.writeFileSync(path.join(out, `${id}-stderr.txt`), r.stderr ?? '');
  const skillsRead = [...new Set([...(r.stdout ?? '').matchAll(/skills[\\/]+([a-z0-9-]+)[\\/]+SKILL\.md/g)].map(m => m[1]))];
  summary.push({ id, exitCode: r.status, errorCode: r.error?.code ?? null, skillsRead });
  fs.writeFileSync(path.join(out, 'summary.json'), JSON.stringify(summary, null, 2));
  if (r.status !== 0) { console.error(`Falha no cenário ${id}. Veja ${id}-stderr.txt; os demais não foram executados.`); process.exitCode = 1; break; }
}
console.log(`Evidências salvas em ${out}. skillsRead registra caminhos observados, não prova sozinho a seleção; revise eventos e respostas.`);
