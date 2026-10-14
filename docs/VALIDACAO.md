# Compatibilidade e validação no Codex

Auditoria iniciada no commit `95b05aefe066a7ea91f1d47e5cfe148214cd6576` do fork `Ronickbr/skills-de-conteudo`. Evidências locais de 14/10/2026, Windows, PowerShell, Node 24.19.0 e Codex CLI `0.162.0-alpha.17.2`.

## Diagnóstico e mudanças

Os cinco frontmatters originais já tinham `name`, `description` e `license: MIT` válidos. Não foi necessário renomear skills ou remover a licença. As descrições foram encurtadas e ganharam limites de escopo para distinguir legenda, roteiro isolado, vídeo pronto e envio de mensagens.

O README anterior apontava ao Claude e ao repositório de origem de outro proprietário. A distribuição tinha recursos locais úteis, mas nenhuma instalação documentada em diretórios de descoberta do Codex, nenhum lockfile, nenhum validador/CI e caminhos fixos em `~/reels-estudio`.

Mudanças implementadas:

- Instalador Node sem dependências: copia pacotes completos, permite seleção e simulação, preserva recursos ocultos, exclui `.env`, `node_modules` e saídas, e recusa sobrescrever instalações. Colisões são verificadas antes de copiar qualquer skill; não há rollback automático para falhas de disco durante a cópia.
- Documentação para `.agents/skills` no projeto e `~/.agents/skills` pessoal, comandos portáveis e exemplos `$nome`. A origem `skills/` é mantida, sem duplicação versionada ou symlinks obrigatórios.
- Resolução de recursos pela pasta instalada, workspace autorizado para projetos, caminhos absolutos substituíveis e exemplos PowerShell. Não é necessário MCP para nenhuma das cinco skills.
- Node ≥22 como baseline suportada de manutenção/mídia; manifests e lockfiles para validador, Playwright e Remotion. Remotion e `@remotion/*` alinhados em 4.0.535; React 19.0.0 preservado.
- Validação de cenas nulas, números inválidos, cores e paths de mídia fora de `public/`; validação dos tempos e da fala por cena, inclusive quando a quantidade de cenas não muda. Cache de narração restaura os paths no JSON; erros HTTP não imprimem corpo de resposta; alinhamentos incompletos não são gravados.
- Comentários redigem promessas futuras em vez de alegar DM enviada; auditoria de perfil calcula a média somente dos critérios avaliados. Autorização já dada para a entrega é respeitada; custo de narração exige autorização quando ainda não existir.
- Correção visual do gancho: o texto tem opacidade 1 desde o quadro zero; a mola continua animando movimento e escala. O template anterior produzia um primeiro quadro vazio.

## Evidências por skill

| Skill | Evidência executada | Limite da conclusão |
|---|---|---|
| `legenda` | Frontmatter, instalação completa, descoberta real habilitada; prompts editoriais na etapa complementar | Ensaio amostral, não garantia de qualidade em todos os temas |
| `perfil` | Frontmatter, instalação completa, descoberta real habilitada; revisão das instruções | Não acessa conta; depende das evidências fornecidas |
| `comentarios` | Frontmatter, instalação completa, descoberta real habilitada; tabela/CSV redigidos no ensaio editorial | Não envia DMs; o material fornecido no ensaio não foi acessado |
| `carrossel` | Exportação real do template: 5 PNGs 1080×1350; capa, conteúdo e CTA inspecionados visualmente | Exemplo técnico de 5 slides; instrução editorial propõe 6–10. Não é teste de geração de copy pelo modelo |
| `reel` | Checklist, TypeScript, cache simulado e real, narração real e render com áudio na etapa complementar | Amostra curta com voz padrão; não avalia qualidade de outras vozes |

Todas as cinco passaram no `quick_validate.py` fornecido com a skill-creator (PyYAML 6.0.3, Python em modo UTF-8). Também passaram no validador YAML mantido neste repositório.

O teste `skills/list` do app-server confirmou exatamente `carrossel`, `comentarios`, `legenda`, `perfil` e `reel` da instalação local, todas com `enabled: true`, sem nomes faltantes ou erros desses pacotes. Não foi iniciado chat ou turn de modelo para esse teste.

## Reproduzir

Na raiz do repositório:

```text
npm ci
npm run validate
npm test
node scripts/install-skills.mjs --dest .agents/skills
node scripts/check-codex-discovery.mjs .
```

O último comando requer `codex` no PATH; pode receber o caminho do executável como terceiro argumento da linha de comando: `node scripts/check-codex-discovery.mjs . "C:/caminho/codex.exe"`. Ele faz somente handshake e `skills/list`, filtra a instalação deste projeto e encerra o processo. Não altera a configuração global. Não execute a instalação de novo no mesmo destino: o instalador recusará a colisão.

Os 12 testes automatizados cobrem frontmatter/YAML duplicado/links ausentes, cópia completa e paths com espaços, exclusão de dependências locais, colisões e preservação, dry-run, seleção, execução fora do diretório de origem, entradas inválidas de cenas, fala alterada, checklist, simulação sem rede, geração/cache com API falsa, erros HTTP sem segredo, alinhamento incompleto, trilha sem ffmpeg e escala inválida do exportador. Áudio da API falsa é um marcador para testar arquivos/cache, não um MP3 real.

Na cópia de trabalho do carrossel, com seu `package.json` e lockfile:

```text
npm ci
npx playwright install chromium
node exportar.mjs carrossel.html out
```

Na cópia do template do reel:

```text
npm ci
npm run typecheck
npm run still -- --frame=0
npx remotion still Reel out/meio.png --props=./cenas.json --frame=450
npx remotion still Reel out/cta.png --props=./cenas.json --frame=880
npm run render -- --concurrency=2 --log=error
```

O exemplo tem seis cenas e duração estimada de 30,0 segundos (901 quadros a 30 fps após arredondamento). O render baixa Chrome Headless Shell na primeira execução; fontes Google podem exigir rede ou cair em fallback. O teste local usou o exemplo sem narração e sem trilha. No sandbox Windows, esbuild foi bloqueado ao ler diretórios ancestrais; renderização e descoberta foram repetidas com autorização fora do sandbox. Isso é uma restrição do ambiente, não uma dependência ausente da skill.

Auditoria npm: o template original reportou 14 dependências afetadas (11 críticas, 2 altas e 1 baixa). Após a atualização, as instalações de raiz, carrossel e reel reportaram zero avisos; `npm audit --audit-level=low` do reel também passou. Esse resultado é datado e deve ser repetido, não uma garantia permanente.

## Exportação final

`npm run render -- --concurrency=2 --log=error` concluiu com código 0. `ffprobe` confirmou H.264, 1080×1920, 30 fps, 901 quadros, duração 30,033333 s e tamanho 5.787.353 bytes. O primeiro quadro foi extraído do MP4 codificado com ffmpeg e inspecionado: o gancho está visível. As prévias do meio (quadro 450) e do CTA (quadro 880) também foram inspecionadas, sem cortes de texto observados nesses quadros. Não foi assistido cada quadro do vídeo nem testada uma trilha de áudio.

Os binários ffprobe/ffmpeg usados para inspecionar o MP4 vêm de `@remotion/compositor-win32-x64-msvc`, instalado com Remotion; isso não demonstra a disponibilidade de `ffmpeg` no PATH para o script de mixagem.

## Pendências e limites

- Narração real e preparação com ffmpeg foram executadas na etapa complementar descrita em [TESTES-COMPLEMENTARES.md](TESTES-COMPLEMENTARES.md). Listagens de vozes e comparação de qualidade entre vozes não foram solicitadas nem testadas.
- Renderização nativa em Linux/macOS: não executada localmente. A CI configura validação/testes/TypeScript em Windows e Linux, sem render de mídia. Seu resultado deve ser lido no PR; configuração não equivale a execução bem-sucedida.
- Prompts editoriais reais das cinco skills foram executados por avaliadores independentes, com correções e repetição dos casos afetados. A seleção nativa do Codex tem registro próprio na etapa complementar; seleção pelas descrições em um ensaio não equivale ao mecanismo nativo.
- Uso pessoal `--user`: documentado, mas não executado neste trabalho. Instalação real foi somente no checkout do workspace; testes usaram destinos temporários.
- Publicação de plugin, envio de mensagens e publicação no Instagram não fazem parte deste escopo.

## Fontes

- [Skills e descoberta no Codex — documentação oficial](https://learn.chatgpt.com/docs/build-skills).
- [App-server e skills/list — documentação oficial](https://learn.chatgpt.com/docs/app-server).
- [Atualização do Remotion — documentação oficial](https://www.remotion.dev/docs/upgrading).
