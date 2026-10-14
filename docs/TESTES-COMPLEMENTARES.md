# Testes complementares de voz, áudio e conteúdo

Etapa de 14/10/2026 solicitada para concluir as pendências do PR #2. Este documento separa execução real, simulação, avaliação editorial e restrições do ambiente.

## ElevenLabs real

O usuário configurou uma chave no `.env` ignorado pelo Git. A disponibilidade foi checada sem exibir seu valor. O pedido de teste continha 69 caracteres e 11 palavras:

> Planeje sua semana com calma. Comente PLANO para receber o checklist.

O sandbox bloqueou a conexão com `EACCES`, sem gerar áudio. A política de permissões não permite escalada nesta sessão. A geração foi executada pelo usuário no PowerShell local com o mesmo `narrar.mjs`, e os arquivos resultantes foram verificados pelo agente. Uma primeira tentativa manual tinha um ponto final incluído no path e falhou antes de chamar a API; o comando foi corrigido.

- Modelo: `eleven_multilingual_v2`; voz padrão `EXAVITQu4vr4xnSDxMaL`, sem alegar sotaque brasileiro nativo.
- `ffprobe`: MP3 mono, 44.100 Hz, 5,250612 s, 84.470 bytes.
- Alinhamento: 11 palavras; último fim em 5,201 s; duração do arquivo de tempos 5,451 s, incluindo a margem de 0,25 s aplicada pelo script.
- Cena 1: 0–2,323 s; cena 2: 2,323–5,451 s. `validarTempos` e o checklist aprovaram consistência com o texto fornecido.
- Reexecução pelo agente: cache reconhecido, exit 0, nenhuma chamada adicional à API.
- Chave não publicada, copiada para o relatório ou enviada ao GitHub. A cobrança efetiva da conta não foi consultada; só uma geração real curta foi solicitada.

O áudio foi decodificado e sua estrutura validada. Este agente não tem entrada auditiva para avaliar pronúncia/expressividade; essa revisão fica disponível ao usuário no MP3/MP4 entregue.

## ffmpeg real

O build n7.1 que acompanha Remotion tem `loudnorm` e `volume`, mas não `afade`. O script passou a usar uma envoltória de volume por quadro para aplicar os fades, e aceita `--ffmpeg <executável>` sem alterar PATH global. O fallback sem ffmpeg continua disponível; um executável explicitamente fornecido e inválido gera erro.

O teste gera localmente um tom de 440 Hz, converte para MP3 e usa esse MP3 curto como entrada. Não usa música de terceiros, voz clonada ou download de mídia. Foi observado um problema do build ao repetir WAV com seek; a integração usa MP3, que é o formato indicado pela skill. Suporte geral a WAV não está estabelecido.

O teste de integração executa o script real, decodifica a saída e verifica duração, repetição, fades e loudness:

| Medição | Resultado local |
|---|---:|
| Duração de entrada | aproximadamente 2 s |
| Duração de saída PCM | 5,5 s |
| Amostragem/canais | 44.100 Hz / estéreo |
| Loudness integrado após fades | −21,21 LUFS |
| RMS estável (1–2 s) | 0,074745 |
| RMS inicial (0–0,1 s) | 0,000860 |
| RMS final (5,35–5,45 s) | 0,007890 |

O alvo de normalização é −20 LUFS antes dos fades; a tolerância do teste é 2,5 LU após os fades. A fonte curta foi repetida, houve sinal também entre 3–4 s e o áudio foi cortado na duração prevista. O teste verifica a preparação da trilha; não faz uma avaliação perceptiva da mixagem.

Reproduzir depois de instalar as dependências de `skills/reel/template`:

```text
npm run test:audio
```

Alternativamente, configure `FFMPEG_BIN` com outro ffmpeg compatível. O teste falha se não encontrar executável, em vez de declarar aprovação sem executá-lo. A CI executa esse comando depois de instalar o template, em Windows e Linux. `npm test` cobre os 12 testes rápidos e pula a integração sem `FFMPEG_BIN`; a integração é executada separadamente.

## Vídeo com narração e trilha

O MP3 da ElevenLabs e a trilha de teste foram carregados na composição Remotion. Foi usado o bundle já compilado na etapa anterior, copiado para uma pasta de ensaio, sem acessar a chave ou modificar a instalação de skills. A composição não mudou nesta etapa; somente scripts/instruções foram corrigidos.

`selectComposition` calculou 200 quadros a 30 fps (6,666667 s), com a cauda de 1,2 s após o arquivo de tempos. `renderMedia` concluiu usando navegador já instalado e fontes de sistema, sem download adicional. `ffprobe` confirmou H.264 1080×1920 e AAC estéreo a 48 kHz, duração do contêiner 6,677 s e 1.319.885 bytes. A trilha preparada tinha 7,2 s e foi limitada pelo render à duração da composição.

É um teste curto de integração, não um reel editorial de 20–45 s. O checklist informa esse desvio de duração como aviso. Não foi realizado teste perceptivo cego de sincronização ou qualidade da voz.

## Prompts reais e revisão editorial

Dois avaliadores independentes selecionaram skills após ler somente os frontmatters e, em seguida, produziram as respostas. Foram registrados seis cenários, sem respostas esperadas fornecidas ao avaliador:

| Caso | Pedido | Seleção observada no ensaio independente |
|---|---|---|
| A | Texto que acompanha post de fotografia, CTA salvar | legenda |
| B | Auditoria de perfil com bio/nome e dados ausentes | perfil |
| C | Comentários com GUIA, dúvida, elogio, objeção, spam e ataque | comentarios |
| D | Copy de seis slides de planejamento semanal | carrossel |
| E | Apenas roteiro isolado/preparatório | nenhuma dessas skills |
| F | Reel tipográfico pronto em MP4, sem voz/música | reel |

O caso E verifica a exclusão de roteiro isolado na descrição de reel; não é registrado como falha por deixar de ativar uma skill fora do escopo. Em F, o ambiente do avaliador proibia render; ele entregou JSON/roteiro e informou esse limite. O JSON real da skill passou no checklist: 25 s, gancho 2 s, CTA PLANO, contrastes aprovados.

Problemas observados e correções:

- A primeira legenda era repetitiva e um gancho presumiu “produto”. A skill agora pede aplicação concreta e preservação do assunto fornecido. A segunda rodada produziu cuidados práticos sem introduzir fotografia de produtos.
- A instrução de perfil trazia um exemplo causal, embora os dados possam ser parciais. Foi explicitado que não se deve atribuir uma causa à falta de clientes sem evidências. A segunda rodada manteve média parcial e critérios não avaliados.
- Seis slides não comportavam obrigatoriamente capa, quatro passos, checklist e CTA separados. A skill agora permite combinar resumo e CTA de salvar, respeitando o número solicitado. A segunda rodada aplicou essa opção.
- Foi explicado que `fala` continua sendo texto da legenda/estimativa quando o reel não tem narração; isso não cria voz por conta própria.
- C preservou texto não enviado, classificou os seis comentários e produziu CSV. A dúvida sobre doces foi encaminhada à revisão humana, pois o conteúdo do guia não foi fornecido.

As respostas integrais estão em [avaliacao-editorial.md](evals/avaliacao-editorial.md) e [avaliacao-midia.md](evals/avaliacao-midia.md). A repetição dos cenários usou o mesmo avaliador, portanto compartilha histórico e não é uma segunda amostra cega. Esses resultados são evidências amostrais, não prova de qualidade geral.

## Seleção nativa do Codex

O sandbox desta sessão não conseguiu iniciar `codex exec` porque não encontra o diretório de configuração. Foi preparado `scripts/check-codex-prompts.mjs`, que executa os seis prompts sem `$nome` no Codex autenticado do usuário, em sessões efêmeras e somente leitura. Não lê `.env` e não chama ElevenLabs. O executável pode ser passado como argumento.

```text
node scripts/check-codex-prompts.mjs
```

Eventos, respostas e resumo ficam em `.validation/model-prompts`, ignorado pelo Git. Os seis cenários foram executados no PowerShell local do usuário e concluíram com exit 0. Os eventos `command_execution` registram leitura de `.agents/skills/legenda/SKILL.md`, `perfil`, `comentarios`, `carrossel` e `reel` nos casos A/B/C/D/F, respectivamente. E não registrou leitura de nenhuma dessas skills. A revisão confirmou respostas correspondentes, não só menções aos nomes. Não havia `$nome` ou indicação da skill esperada nos pedidos.

As respostas nativas completas estão em [avaliacao-nativa.md](evals/avaliacao-nativa.md). A leitura de conteúdo em alguns eventos do PowerShell apresentou caracteres substituídos pelo transporte do subprocesso; os arquivos-fonte são UTF-8 e as respostas finais preservaram os acentos. Isso não impediu a seleção observada, mas o ensaio não valida todas as configurações de encoding de shells Windows.

Limites editoriais observados na rodada nativa: B propôs direct porque o destino do link não foi fornecido; essa é uma alternativa sugerida, não uma validação do canal original. C acrescentou uma orientação fotográfica geral para doces sem afirmar que leu o guia. F interpretou a condição do ensaio como proibição de scripts em geral (a condição só vedava executar o próprio ensaio); também havia sandbox somente leitura, que impediria gerar arquivos. Registrou corretamente ausência de MP4. A renderização real com áudio é uma evidência separada.

Conclusão delimitada: seleção implícita nativa observada nas cinco skills e exclusão de roteiro isolado observada em E; qualidade editorial avaliada por amostras e melhorada nos casos identificados. Não se afirma que todo prompt futuro terá o mesmo resultado.

## Referências

- [FFmpeg: filtros de áudio e volume](https://ffmpeg.org/ffmpeg-filters.html).
- [Remotion: renderMedia e bundle local](https://www.remotion.dev/docs/renderer/render-media).
