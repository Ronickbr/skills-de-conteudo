/* Funções usadas pelos três scripts. Node puro, sem dependência. */
import fs from 'node:fs';
import path from 'node:path';

export const TIPOS = ['gancho', 'titulo', 'lista', 'numero', 'antes-depois', 'cta'];

/** lê --chave valor e --flag da linha de comando */
export const lerArgs = (argv = process.argv.slice(2)) => {
  const a = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const x = argv[i];
    if (x.startsWith('--')) {
      const nome = x.slice(2);
      const prox = argv[i + 1];
      if (prox !== undefined && !prox.startsWith('--')) { a[nome] = prox; i++; } else a[nome] = true;
    } else a._.push(x);
  }
  return a;
};

export const pastaProjeto = (args) => path.resolve(typeof args.projeto === 'string' ? args.projeto : process.cwd());

export const lerCenas = (projeto) => {
  const arq = path.join(projeto, 'cenas.json');
  if (!fs.existsSync(arq)) throw new Error(`Não achei ${arq}. Rode o script de dentro da pasta do reel ou use --projeto <pasta>.`);
  try {
    return { arq, dados: JSON.parse(fs.readFileSync(arq, 'utf8')) };
  } catch (e) {
    throw new Error(`cenas.json não é um JSON válido: ${e.message}`);
  }
};

export const salvarCenas = (arq, dados) => fs.writeFileSync(arq, JSON.stringify(dados, null, 2) + '\n');

/** Lê uma variável do ambiente ou de um .env (na pasta do reel ou na atual). Nunca imprime o valor. */
export const lerSegredo = (nome, projeto) => {
  if (process.env[nome]) return process.env[nome].trim();
  for (const dir of [projeto, process.cwd()]) {
    const env = path.join(dir, '.env');
    if (!fs.existsSync(env)) continue;
    const linha = fs.readFileSync(env, 'utf8').split('\n').find((l) => l.trim().startsWith(`${nome}=`));
    if (linha) {
      const v = linha.slice(linha.indexOf('=') + 1).trim().replace(/^["']|["']$/g, '');
      if (v) return v;
    }
  }
  return null;
};

const texto = (v) => typeof v === 'string' && v.trim().length > 0;

/** Erros que impedem o render. Devolve lista vazia quando está tudo certo. */
export const validar = (d) => {
  const erros = [];
  if (!d || typeof d !== 'object' || Array.isArray(d)) return ['O arquivo precisa ser um objeto JSON.'];
  if (!Array.isArray(d.cenas) || d.cenas.length === 0) return ['Falta a lista "cenas" (com pelo menos uma cena).'];
  d.cenas.forEach((c, i) => {
    const n = `Cena ${i + 1}`;
    if (!c || typeof c !== 'object' || Array.isArray(c)) { erros.push(`${n}: precisa ser um objeto.`); return; }
    if (!TIPOS.includes(c.tipo)) erros.push(`${n}: tipo "${c.tipo}" não existe. Use um destes: ${TIPOS.join(', ')}.`);
    if (!texto(c.fala)) erros.push(`${n}: falta "fala" (o texto dito nessa cena).`);
    if (c.duracao !== undefined && !(Number.isFinite(c.duracao) && c.duracao > 0)) erros.push(`${n}: "duracao" precisa ser número de segundos.`);
    if ((c.tipo === 'gancho' || c.tipo === 'titulo') && !texto(c.titulo)) erros.push(`${n}: falta "titulo".`);
    if (c.tipo === 'lista' && (!Array.isArray(c.itens) || c.itens.length < 2 || !c.itens.every(texto))) erros.push(`${n}: "itens" precisa ter pelo menos 2 textos.`);
    if (c.tipo === 'numero' && !Number.isFinite(c.ate)) erros.push(`${n}: "ate" precisa ser número finito.`);
    if (c.de !== undefined && !Number.isFinite(c.de)) erros.push(`${n}: "de" precisa ser número finito.`);
    if (c.decimais !== undefined && (!Number.isInteger(c.decimais) || c.decimais < 0 || c.decimais > 10)) erros.push(`${n}: "decimais" deve ser inteiro de 0 a 10.`);
    if (c.tipo === 'antes-depois' && !(texto(c.antes) && texto(c.depois))) erros.push(`${n}: faltam "antes" e "depois".`);
    if (c.tipo === 'cta' && !texto(c.palavra)) erros.push(`${n}: falta "palavra" (a palavra-chave que a pessoa comenta).`);
  });
  for (const key of ['narracao', 'palavras', 'trilha']) {
    const v = d[key];
    if (v != null && (typeof v !== 'string' || !v.trim() || path.isAbsolute(v) || /[\\:]/.test(v) || v.split('/').includes('..'))) erros.push(`"${key}" deve ser caminho relativo dentro de public/.`);
  }
  if (d.cores != null && (typeof d.cores !== 'object' || Array.isArray(d.cores))) erros.push('"cores" precisa ser um objeto.');
  else for (const [key, value] of Object.entries(d.cores ?? {})) {
    if (!/^#[0-9a-f]{6}$/i.test(value)) erros.push(`Cor ${key}: use #rrggbb.`);
  }
  if (d.volumeTrilha !== undefined && !(typeof d.volumeTrilha === 'number' && d.volumeTrilha >= 0 && d.volumeTrilha <= 1)) erros.push('"volumeTrilha" vai de 0 a 1.');
  return erros;
};

/** Rejeita alinhamentos inválidos e fala alterada mesmo mantendo o número de cenas. */
export const validarTempos = (t, cenas) => {
  if (!t || !Number.isFinite(t.duracao) || t.duracao <= 0 || !Array.isArray(t.cenas) || !Array.isArray(t.palavras)) return ['palavras.json inválido: faltam duração, cenas ou palavras.'];
  const erros = [];
  if (t.cenas.length !== cenas.length) return ['palavras.json tem número de cenas diferente; rode narrar.mjs de novo.'];
  t.cenas.forEach((c, i) => {
    if (!c || !Number.isFinite(c.inicio) || !Number.isFinite(c.fim) || c.inicio < 0 || c.fim <= c.inicio || c.fim > t.duracao + 0.01 || (i && c.inicio < t.cenas[i - 1]?.fim - 0.01)) erros.push(`Tempos inválidos na cena ${i + 1}.`);
  });
  t.palavras.forEach((p, i) => {
    if (!p || !texto(p.texto) || !Number.isFinite(p.inicio) || !Number.isFinite(p.fim) || p.inicio < 0 || p.fim < p.inicio || p.fim > t.duracao + 0.01 || !Number.isInteger(p.cena) || p.cena < 0 || p.cena >= cenas.length || (i && p.inicio < t.palavras[i - 1]?.inicio)) erros.push(`Tempo inválido na palavra ${i + 1}.`);
  });
  cenas.forEach((c, i) => {
    const recebido = t.palavras.filter(p => p?.cena === i).map(p => p.texto).join(' ').trim();
    const esperado = c.fala.trim().replace(/\s+/g, ' ');
    if (recebido !== esperado) erros.push(`A fala da cena ${i + 1} mudou após narrar; rode narrar.mjs de novo.`);
  });
  return erros;
};

/* Mesma estimativa de template/src/tempo.ts (para reel sem narração). */
export const estimarTempos = (cenas) => {
  const palavras = [];
  const blocos = [];
  let t = 0;
  cenas.forEach((cena, i) => {
    const ps = cena.fala.trim().split(/\s+/).filter(Boolean);
    const minimo = cena.tipo === 'cta' ? 3.0 : 1.8;
    const dur = cena.duracao ?? Math.max(minimo, ps.length / 2.9 + 0.35);
    const pesos = ps.map((p) => p.length + 2);
    const soma = pesos.reduce((a, b) => a + b, 0) || 1;
    const util = Math.max(0.5, dur - 0.35);
    let cursor = t + 0.1;
    ps.forEach((p, k) => {
      const d = (pesos[k] / soma) * util;
      palavras.push({ texto: p, inicio: cursor, fim: cursor + d * 0.92, cena: i });
      cursor += d;
    });
    blocos.push({ inicio: t, fim: t + dur });
    t += dur;
  });
  return { palavras, cenas: blocos, duracao: t };
};

/** contraste WCAG entre duas cores hex; null se alguma não for hex */
export const contraste = (a, b) => {
  const lum = (hex) => {
    let h = String(hex).trim().replace('#', '');
    if (h.length === 3) h = h.split('').map((x) => x + x).join('');
    if (!/^[0-9a-f]{6}$/i.test(h)) return null;
    const [r, g, bl] = [0, 2, 4].map((i) => {
      const c = parseInt(h.slice(i, i + 2), 16) / 255;
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };
  const la = lum(a);
  const lb = lum(b);
  if (la === null || lb === null) return null;
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
};

export const CORES_PADRAO = { fundo: '#0E0F12', texto: '#F4F4F2', destaque: '#FFC94A', suave: '#9A9CA3', sobreDestaque: '#0E0F12' };
