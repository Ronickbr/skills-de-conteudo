# Avaliação nativa do Codex

Executada pelo usuário no PowerShell local, com o Codex configurado, sem override de modelo, sem `$nome`, em sessões efêmeras e somente leitura. O agente revisou os eventos e as respostas. Não houve chamada ElevenLabs nestes testes.

## Cenário A

Exit code do Codex: 0. Leitura de skills nos eventos: `.agents/skills/legenda/SKILL.md` (exit 0). SHA256 dos eventos: `e48efd3304e47837b5acad4619ed52d9362e7b607a5fd9a819c2385d745c23e1`.

### Pedido executado

Escreva o texto que acompanha meu post no Instagram. Público: fotógrafos iniciantes. O post ensina a limpar a lente, usar luz de janela e apoiar o celular. Tom didático, sem emojis. Quero que salvem para consultar. Não tenho resultados numéricos para citar.

Condições do ensaio: responda usando as capacidades pertinentes disponíveis. O ambiente é somente leitura; se impedir arquivos ou renderização, entregue o material textual que puder e registre o limite. Não leia .env ou credenciais, não chame APIs de narração e não publique ou envie mensagens. Não execute scripts deste ensaio.

### Resposta integral

**Opções de primeira linha**

- **Curiosidade — recomendada:** Antes de tocar no botão de fotografar, confira a lente, a luz e o apoio do celular.
- **Benefício concreto:** Prepare sua próxima foto com cuidados simples que você pode aplicar em casa.
- **Identificação:** Suas fotos ficam embaçadas ou tremidas? Comece pela lente, pela luz e pelo apoio.

Recomendo a primeira porque apresenta uma sequência prática que o leitor pode consultar antes de fotografar.

**Legenda pronta**

Antes de tocar no botão de fotografar, confira a lente, a luz e o apoio do celular.

Comece pela lente: passe delicadamente um pano de microfibra limpo e seco para remover marcas de dedos. Evite usar a camiseta ou papel, que podem deixar resíduos.

Aproveite a luz de uma janela. Posicione o que vai fotografar perto dela e observe como a luz chega. Se o sol direto criar sombras muito fortes, experimente uma cortina fina para suavizá-lo.

Apoie o celular em uma superfície firme e confira se ele está seguro. Use o temporizador para evitar movimentá-lo ao tocar na tela.

Antes de fazer outra foto, observe o resultado e ajuste uma coisa por vez. Isso ajuda você a perceber o efeito de cada cuidado.

Salve este post para consultar antes da sua próxima sessão de fotos.

#Fotografia #FotografiaParaIniciantes #FotografiaComCelular #LuzNatural

Entrega textual no chat; não foram necessários arquivos, renderização ou scripts.

## Cenário B

Exit code do Codex: 0. Leitura de skills nos eventos: `.agents/skills/perfil/SKILL.md` (exit 0). SHA256 dos eventos: `3f05551a9e06d1edd13e55ddce42515bd56184a994281e154a22b6f3b532e4d9`.

### Pedido executado

Meu perfil atrai poucos clientes. Nome: Clara | fotografia de produtos. Bio: Fotos claras para lojas pequenas. Fotógrafa há 4 anos. Peça orçamento no link. Objetivo: orçamentos de pequenos lojistas. Não forneci link, destaques ou posts. Avalie o que puder e proponha três bios, sem inventar prova.

Condições do ensaio: responda usando as capacidades pertinentes disponíveis. O ambiente é somente leitura; se impedir arquivos ou renderização, entregue o material textual que puder e registre o limite. Não leia .env ou credenciais, não chame APIs de narração e não publique ou envie mensagens. Não execute scripts deste ensaio.

### Resposta integral

A bio já deixa claro o serviço e o público, mas “fotos claras” explica pouco o valor para o lojista. **Só com nome e bio, não dá para determinar por que chegam poucos clientes.**

Avaliei o nome “Clara | fotografia de produtos”, a bio e seu objetivo de receber orçamentos de pequenos lojistas. Link, destaques e posts não foram fornecidos.

| Critério | Nota | Evidência e avaliação |
|---|---:|---|
| Para quem é | 8 | “Lojas pequenas” identifica o público; o nome identifica o serviço. |
| Promessa | 5 | “Fotos claras” descreve uma qualidade, mas pouco diferencia a entrega. |
| Prova | 6 | “Fotógrafa há 4 anos” informa experiência; não comprova resultados para clientes. |
| Chamada clara | 8 | “Peça orçamento no link” apresenta uma ação única e objetiva. |
| Link | Não avaliado | Falta o destino para verificar o caminho até o orçamento. |
| Destaques | Não avaliado | Faltam títulos e conteúdos. |
| Grid | Não avaliado | Faltam os posts. |

**Nota parcial: 6,8/10 — 4 de 7 critérios avaliados.** A principal oportunidade no texto é tornar a oferta mais concreta.

As três bios abaixo usam apenas a experiência informada. Como o destino do link não foi fornecido, proponho o **direct** como canal de orçamento. As contagens incluem espaços e quebras de linha.

**1. Direta — 113 caracteres**
```text
Fotografia para pequenos lojistas
Fotos claras dos seus produtos
4 anos de experiência
Peça orçamento pelo direct
```

**2. Por resultado — 98 caracteres**
```text
Fotos claras para sua loja
Para pequenos lojistas
4 anos de experiência
Peça orçamento pelo direct
```

**3. Por identificação — 123 caracteres**
```text
Sua loja precisa de fotos de produtos?
Fotos claras para pequenos lojistas
4 anos de experiência
Peça orçamento pelo direct
```

**Recomendo a direta:** ela apresenta serviço, público, entrega, experiência e próximo passo sem exigir interpretação.

**Campo Nome sugerido:** “Clara | Fotografia de produtos”. Seu nome atual já cumpre bem essa função.

As três mudanças prioritárias são:

1. **Especificar a entrega na bio.** Adote a versão direta; se houver um diferencial real, substitua “fotos claras” por ele. Vem primeiro porque a promessa recebeu a menor nota entre os critérios avaliados. **Tempo: 10 minutos.**
2. **Alinhar a chamada ao canal de orçamento.** Use o direct se você atende por lá; se preferir o link, confira se ele abre diretamente o canal adequado e ajuste a chamada. Isso facilita o próximo passo. **Tempo: 10–15 minutos.**
3. **Dar contexto aos quatro anos de experiência.** Se tiver material autorizado, selecione trabalhos reais e explique brevemente o pedido e a entrega. Isso complementa a prova hoje restrita ao tempo de atuação. **Tempo: 30–60 minutos.**

A entrega ficou no chat; não executei scripts nem criei arquivos. O ambiente somente leitura não impediu esta avaliação textual.

Qual das três versões você quer refinar?

## Cenário C

Exit code do Codex: 0. Leitura de skills nos eventos: `.agents/skills/comentarios/SKILL.md` (exit 0). SHA256 dos eventos: `929bc23736cee7b917b12f17b994a94fa28388abc83d1d2c81e4a55d55f1c024`.

### Pedido executado

Prepare respostas para os comentários do post sobre fotografar produtos com celular. CTA GUIA. Material: https://example.com/guia-fotos. Tom cordial. Comentários: @ana: GUIA; @bia: Obrigada, vou testar; @leo: Serve para doces?; @rui: Isso não funciona em quarto escuro; @spam: Ganhe seguidores no meu site; @caio: Vocês são idiotas. Quero tabela e CSV, não envie nada.

Condições do ensaio: responda usando as capacidades pertinentes disponíveis. O ambiente é somente leitura; se impedir arquivos ou renderização, entregue o material textual que puder e registre o limite. Não leia .env ou credenciais, não chame APIs de narração e não publique ou envie mensagens. Não execute scripts deste ensaio.

### Resposta integral

6 comentários: 1 pedido de material, 1 elogio, 1 dúvida, 1 objeção, 1 spam e 1 ofensa. **1 DM preparada; 2 comentários sem resposta.**

| # | Usuário | Comentário | Intenção | Resposta pública | DM |
|---|---|---|---|---|---|
| 1 | @ana | GUIA | Pediu material | Ana, vou te enviar o guia no direct! Se não aparecer, confira as solicitações. | Oi, Ana! Aqui está o guia: https://example.com/guia-fotos. Use como apoio para testar as fotos com seu celular. Qual produto você quer fotografar primeiro? |
| 2 | @bia | Obrigada, vou testar | Elogio | Obrigado, Bia! Depois conta como ficaram as fotos. | — |
| 3 | @leo | Serve para doces? | Dúvida | Sim, Leo! Para doces, use luz suave e teste um ângulo que destaque a textura e a cobertura. | — |
| 4 | @rui | Isso não funciona em quarto escuro | Objeção | Você tem razão, Rui: pouca luz dificulta. Experimente perto de uma janela ou com uma luz suave sobre o produto. | — |
| 5 | @spam | Ganhe seguidores no meu site | Spam | Sem resposta; sugerido ocultar ou excluir. | — |
| 6 | @caio | Vocês são idiotas | Ofensa | Sem resposta; sugerido ocultar ou restringir. | — |

```csv
"numero","usuario","comentario","intencao","resposta_publica","dm","obs"
"1","@ana","GUIA","pediu_material","Ana, vou te enviar o guia no direct! Se não aparecer, confira as solicitações.","Oi, Ana! Aqui está o guia: https://example.com/guia-fotos. Use como apoio para testar as fotos com seu celular. Qual produto você quer fotografar primeiro?",""
"2","@bia","Obrigada, vou testar","elogio","Obrigado, Bia! Depois conta como ficaram as fotos.","",""
"3","@leo","Serve para doces?","duvida","Sim, Leo! Para doces, use luz suave e teste um ângulo que destaque a textura e a cobertura.","",""
"4","@rui","Isso não funciona em quarto escuro","objecao","Você tem razão, Rui: pouca luz dificulta. Experimente perto de uma janela ou com uma luz suave sobre o produto.","","Crítica legítima; merece atenção humana."
"5","@spam","Ganhe seguidores no meu site","spam","","","Ocultar ou excluir."
"6","@caio","Vocês são idiotas","hater","","","Ocultar ou restringir."
```

Não há marcadores pendentes. O link foi reproduzido conforme fornecido. Rui trouxe uma limitação legítima e merece atenção.

O ambiente somente leitura impede salvar o arquivo; o CSV está disponível acima para copiar. Nada foi publicado ou enviado: os textos estão prontos para uso manual.

## Cenário D

Exit code do Codex: 0. Leitura de skills nos eventos: `.agents/skills/carrossel/SKILL.md` (exit 0). SHA256 dos eventos: `9168106e7b7c02016bb389359b11d40901fcc4f04f0faae8918fb0abe3f8485b`.

### Pedido executado

Quero um post em seis imagens que ensine universitários a organizar uma semana de estudos: escolha as matérias, reserve blocos, faça pausas e revise. Meu objetivo é salvamento. Tom acolhedor, sem promessa de notas melhores. Entregue apenas a copy slide a slide e três opções de capa; não gere arquivos.

Condições do ensaio: responda usando as capacidades pertinentes disponíveis. O ambiente é somente leitura; se impedir arquivos ou renderização, entregue o material textual que puder e registre o limite. Não leia .env ou credenciais, não chame APIs de narração e não publique ou envie mensagens. Não execute scripts deste ensaio.

### Resposta integral

**Três opções de capa**

1. **Sua semana de estudos em 4 passos** — recomendada.
2. **Sua semana de estudos precisa de espaço para respirar**
3. **Organize os estudos sem preencher cada minuto da semana**

**Slide 1 — Capa**

Sua semana de estudos em 4 passos\
Um planejamento que cabe na sua rotina.\
Arraste para o lado.

**Slide 2 — Escolha as matérias**

Olhe os prazos e escolha as prioridades da semana.\
Exemplo: começar o trabalho de História e revisar Estatística. Agora, vamos reservar tempo.

**Slide 3 — Reserve blocos possíveis**

Encaixe os estudos entre aulas, deslocamentos e descanso.\
Dê uma tarefa a cada bloco: terça, 14h, resolver três exercícios. E as pausas?

**Slide 4 — Inclua as pausas**

Reserve intervalos entre os blocos para levantar, beber água ou descansar.\
Se o cansaço aparecer antes, ajuste. Depois, retome o que estudou.

**Slide 5 — Volte para revisar**

Reserve um bloco para tentar lembrar sem consultar e conferir depois.\
Exemplo: explicar um conceito com suas palavras. Veja a checklist no próximo slide.

**Slide 6 — Sua checklist da semana**

☐ Escolher matérias e prioridades\
☐ Reservar blocos com tarefas claras\
☐ Incluir pausas\
☐ Separar tempo para revisão\

A semana mudou? Ajuste o plano com calma.\
**Salve para consultar ao organizar sua próxima semana.**

## Cenário E

Exit code do Codex: 0. Leitura de skills nos eventos: nenhuma dessas cinco skills. SHA256 dos eventos: `d9bedb541f38955ec3aebb228326b6e5081a9954a47ac47271d795a239154634`.

### Pedido executado

Quero somente um roteiro isolado de vídeo de 25 segundos sobre planejar a semana. Público universitário, tom direto, CTA comentar PLANO. Não preciso de vídeo pronto, imagens ou arquivos.

Condições do ensaio: responda usando as capacidades pertinentes disponíveis. O ambiente é somente leitura; se impedir arquivos ou renderização, entregue o material textual que puder e registre o limite. Não leia .env ou credenciais, não chame APIs de narração e não publique ou envie mensagens. Não execute scripts deste ensaio.

### Resposta integral

**Roteiro — 25 segundos**

**0–4s | Gancho**\
“Você começa a semana sem saber qual trabalho entregar primeiro?”

**4–10s | Passo 1**\
“Antes de segunda, liste provas, entregas e aulas. Coloque os prazos no calendário.”

**10–17s | Passo 2**\
“Escolha três prioridades e reserve blocos de estudo. Comece pelo que vence primeiro.”

**17–21s | Passo 3**\
“Deixe espaço para descanso e imprevistos. Sua agenda precisa ser possível.”

**21–25s | CTA**\
“Qual é sua prioridade nesta semana? Comente PLANO.”

## Cenário F

Exit code do Codex: 0. Leitura de skills nos eventos: `.agents/skills/reel/SKILL.md` (exit 0). SHA256 dos eventos: `03718e19b74e72b8dca9ea9789b8e1fd24809aef32e50801b4b74fd0cf8080ef`.

### Pedido executado

Crie e entregue um reel vertical tipográfico pronto em MP4 sobre planejar a semana. Público universitários, 25 segundos, tom direto, sem voz e sem música. CTA comentar PLANO para receber meu checklist.

Condições do ensaio: responda usando as capacidades pertinentes disponíveis. O ambiente é somente leitura; se impedir arquivos ou renderização, entregue o material textual que puder e registre o limite. Não leia .env ou credenciais, não chame APIs de narração e não publique ou envie mensagens. Não execute scripts deste ensaio.

### Resposta integral

**Roteiro final: “Planeje sua semana” — 25 segundos**, vertical 1080 × 1920, sem voz e sem música.

Fundo preto, texto branco e palavras-chave em amarelo. Tipografia grande e centralizada; entradas curtas, com movimento suave.

| Tempo | Texto na tela | Animação |
|---|---|---|
| 0–2 s | **Sua semana virou uma correria?** | Gancho inteiro visível desde o primeiro quadro. |
| 2–6 s | **1. Coloque os compromissos**<br>Aulas, provas e entregas. | Título entra; compromissos aparecem em sequência. |
| 6–10 s | **2. Escolha 3 prioridades**<br>O que precisa avançar nesta semana? | Número **3** cresce; pergunta entra abaixo. |
| 10–15 s | **3. Reserve blocos de estudo**<br>Defina dia, horário e tarefa. | “Dia”, “horário” e “tarefa” entram um por vez. |
| 15–20 s | **Deixe espaço para imprevistos**<br>Inclua pausas e descanso. | Segunda linha aparece após 2 segundos; destaque passa para “descanso”. |
| 20–25 s | **Comenta PLANO**<br>para receber meu checklist. | **PLANO** entra em um bloco amarelo, com pulso suave. CTA permanece até o fim. |

**Legenda do post:**\
Organize aulas, entregas e blocos de estudo antes de começar a semana. Escolha 3 prioridades e deixe espaço para descansar.

Comenta **PLANO** para receber meu checklist.

**Limite do ensaio:** não gerei o MP4 nem arquivos de prévia. O ambiente é somente leitura e você proibiu executar scripts, o que impede a renderização. A sequência soma 25 segundos; a aparência e as animações ainda não foram verificadas em vídeo.

## Revisão observável

As leituras e entregas corresponderam a legenda, perfil, comentarios, carrossel e reel nos casos A/B/C/D/F. E produziu roteiro genérico sem carregar nenhuma das cinco. Os ganchos de A mediram 83, 76 e 81 caracteres; as bios de B mediram 113, 98 e 123, incluindo quebras LF, confirmando as contagens apresentadas. B avaliou 4/7 critérios e declarou ausência de evidência causal. C deixou campos vazios no CSV para spam/hater e não afirmou envio concluído. D preservou seis slides e CTA de salvar. F somou 25 segundos e declarou não ter gerado MP4. Limites e observações sobre alternativas de canal, conteúdo fotográfico geral e restrições do ensaio estão descritos em TESTES-COMPLEMENTARES.md.
