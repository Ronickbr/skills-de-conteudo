# Skills de Conteúdo para OpenAI Codex

Cinco skills em português para preparar conteúdo de Instagram. Os pacotes continuam no formato aberto de agent skills, também utilizável por outros agentes que leem `SKILL.md`.

| Skill | Entrega | Dependências em execução |
|---|---|---|
| `legenda` | Três ganchos, legenda, CTA e hashtags | Nenhuma ferramenta externa |
| `perfil` | Auditoria com evidências, três bios e prioridades | Bio/posts fornecidos; imagens quando o ambiente permitir |
| `comentarios` | Classificação, respostas públicas e DMs em tabela/CSV | Comentários fornecidos; não envia mensagens |
| `carrossel` | Copy, HTML e PNGs 1080×1350 | Node ≥22, npm, Playwright e Chromium ou Chrome |
| `reel` | Roteiro e MP4 tipográfico 1080×1920 | Node ≥22, npm, Remotion e navegador headless |

Narração do reel é opcional e usa a conta ElevenLabs do usuário. Trilha é fornecida pelo usuário. ffmpeg é opcional para preparar a trilha. Nenhuma skill publica, agenda posts ou envia DMs.

## Instalação no Codex

O Codex descobre skills em `.agents/skills` nos projetos e em `~/.agents/skills` para uso pessoal. `skills/` nesta distribuição é a origem dos pacotes, não um diretório descoberto automaticamente. Consulte a [documentação oficial de skills](https://learn.chatgpt.com/docs/build-skills).

Clone o fork correto e entre nele (PowerShell, bash ou zsh):

```text
git clone https://github.com/Ronickbr/skills-de-conteudo.git
cd skills-de-conteudo
```

Para usar as cinco skills ao abrir **este repositório** no Codex:

```text
node scripts/install-skills.mjs --dest .agents/skills --dry-run
node scripts/install-skills.mjs --dest .agents/skills
```

Para instalar em **outro projeto**, passe o caminho de sua pasta `.agents/skills`, entre aspas quando houver espaços:

```text
node scripts/install-skills.mjs --dest "C:/projetos/meu-projeto/.agents/skills"
```

No macOS/Linux, use por exemplo `--dest "/caminho/meu-projeto/.agents/skills"`. Para disponibilizar pessoalmente em todos os projetos:

```text
node scripts/install-skills.mjs --user
```

Instale somente uma skill com `--skill legenda`; repita `--skill` para escolher várias. O instalador funciona sem `npm install`, copia recursos ocultos como `.env.exemplo`, exclui dependências locais e **recusa destinos já existentes**. Para atualizar, preserve trabalhos e configurações, mova a instalação anterior para fora da pasta de descoberta e instale novamente. Não mantenha duas cópias com o mesmo nome em pastas descobertas.

Sem Node: copie manualmente as cinco pastas de `skills/` para `.agents/skills/` ou `~/.agents/skills/`, incluindo todos os recursos. As três skills de texto não exigem Node para uso. ZIP: extraia antes de copiar. Não é necessário modificar `config.toml` ou instalar MCP. O Codex detecta mudanças; se a lista não atualizar, reinicie-o. Este PR não instala nada no diretório pessoal automaticamente.

## Invocação

Use `$nome` no pedido ou deixe o Codex selecionar pela descrição. Na CLI/IDE, `/skills` permite conferir a lista.

| Skill | Exemplo |
|---|---|
| `legenda` | `Use $legenda para este carrossel: [texto]. Público: fotógrafos iniciantes. CTA: salvar. Tom didático.` |
| `perfil` | `Use $perfil. Bio: [...]. Nome: [...]. Destaques: [...]. Posts: [...]. Objetivo: captar clientes.` |
| `comentarios` | `Use $comentarios para estes comentários: [...]. CTA GUIA, material: [link]. Apenas prepare as respostas.` |
| `carrossel` | `Use $carrossel e entregue HTML e PNGs de 6 slides sobre organização de estudos. Público universitário. CTA salvar.` |
| `reel` | `Use $reel e entregue um MP4 de 25 segundos sobre planejamento semanal. Sem voz e sem música. CTA comentar PLANO.` |

Em ambientes sem shell/navegador, carrossel e reel podem entregar copy/roteiro, mas não exportam PNG/MP4. O agente deve informar a limitação. Download de dependências e execução de navegador obedecem às permissões do ambiente.

## Dependências de mídia

Copie recursos da **pasta instalada da skill**, nunca suponha que o diretório atual é essa pasta. Use uma pasta de trabalho autorizada e coloque caminhos entre aspas.

**Carrossel:** copie `templates/carrossel.html`, `scripts/exportar.mjs`, `package.json` e `package-lock.json` para a pasta de trabalho, edite o HTML e execute nela:

```text
npm ci
npx playwright install chromium
node exportar.mjs carrossel.html out
```

Chrome instalado pode servir como alternativa ao Chromium. Linux pode precisar das bibliotecas de sistema do navegador (`npx playwright install --with-deps chromium`, com permissões apropriadas).

**Reel:** copie o conteúdo de `template/` para `reels-estudio/` no workspace e execute nessa pasta:

```text
npm ci
npm run typecheck
npm run still
npm run render
```

Esses comandos usam o exemplo da raiz. Para um vídeo próprio, siga `skills/reel/SKILL.md`, crie `reels/<slug>/cenas.json` e `public/` e passe `--props` e `--public-dir` ao Remotion. Scripts auxiliares ficam na pasta instalada da skill. Antes de narrar, rode `narrar.mjs --simular`; ele não chama a API. Autorize o custo antes da chamada real quando essa autorização ainda não existir. A chave fica no ambiente ou `.env` local, nunca no chat ou no Git. Fontes Google são opcionais; `fonte: "sistema"` e `fonteItalica: "sistema"` evitam seu download.

## Validação e testes

Na raiz, para manutenção:

```text
npm ci
npm run validate
npm test
```

Para validar cópias instaladas: `node scripts/validate-skills.mjs "caminho/.agents/skills"`. O validador verifica YAML, nome, descrição, corpo e links locais. Não prova qualidade editorial ou ativação real pelo modelo. Os testes verificam instalação, preservação de arquivos, scripts de mídia e narração com API simulada; não usam chave real ou créditos.

A CI executa validação, testes e TypeScript em Windows e Linux. Veja [docs/VALIDACAO.md](docs/VALIDACAO.md) para evidências, smoke tests e pendências. `npm audit` permite repetir a consulta de avisos de segurança por pacote.

Com as cinco skills instaladas neste checkout e Codex no PATH, `node scripts/check-codex-discovery.mjs .` confirma a descoberta real pelo app-server sem iniciar chat ou modelo.

## Estrutura e licença

`skills/<nome>/SKILL.md` contém frontmatter e instruções; `scripts/`, `templates/`, `template/` e `exemplos/` são recursos relativos de cada pacote. O instalador mantém essa estrutura. Metadados UI em `agents/openai.yaml` são opcionais e não são necessários à execução. Dependências npm são declaradas nos manifests de mídia; não são ferramentas MCP.

Conteúdo original por TAOS AI · [@andreoliveira.ai](https://www.instagram.com/andreoliveira.ai/). Adaptação no fork `Ronickbr/skills-de-conteudo`. Licença [MIT](LICENSE).
