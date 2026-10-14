# Avaliação independente: cenários D e E

Método: li inicialmente somente os frontmatters das cinco skills. Há cópias em `skills/` e `.agents/skills/`, com descrições iguais. A seleção foi feita por leitura independente dessas descrições; este ensaio não testa o mecanismo nativo de seleção implícita do Codex. Depois li somente o corpo de `skills/carrossel/SKILL.md`, escolhido para D. Não alterei o repositório, não chamei APIs externas, não instalei ferramentas e não renderizei mídia. Este relatório é o registro autorizado pelo avaliador; nenhum arquivo solicitado nos prompts simulados foi gerado.

## Cenário D

Pedido: “Quero um post em seis imagens que ensine universitários a organizar uma semana de estudos: escolha as matérias, reserve blocos, faça pausas e revise. Meu objetivo é salvamento. Tom acolhedor, sem promessa de notas melhores. Neste teste entregue apenas a copy slide a slide e três opções de capa; não gere arquivos.”

Seleção: **carrossel**, pois sua descrição inclui posts com vários slides e copy. As outras quatro descrições tratam de comentários, legendas, auditoria de perfil ou vídeo. A restrição explícita do usuário autoriza somente copy; a orientação inicial do corpo da skill manda respeitar o escopo explícito, portanto interrompo o fluxo antes de HTML/PNG.

### Resposta completa ao prompt

Formato: passo a passo, para transformar o planejamento da semana em quatro ações simples.

Três opções de capa:

1. **Sua semana de estudos em 4 passos** — recomendada: deixa claro o que o post ensina.
2. **Sua semana de estudos não precisa ficar lotada**
3. **Organize seus estudos com espaço para respirar**

| Slide | Tipo | Copy |
|---|---|---|
| 1 | Capa | **Sua semana de estudos em 4 passos**\nUm plano que caiba na sua rotina. Arrasta para o lado. |
| 2 | Passo 1 | **Escolha as matérias da semana**\nOlhe prazos e dificuldades. Escolha o que precisa de atenção primeiro. Agora, encontre espaço para isso. |
| 3 | Passo 2 | **Reserve blocos que caibam na rotina**\nMarque aulas e compromissos. Nos horários livres, reserve blocos para tarefas específicas, como resolver exercícios. E as pausas? |
| 4 | Passo 3 | **Inclua pausas no plano**\nEntre os blocos, reserve tempo para descansar. Você não precisa preencher todos os horários. Falta deixar espaço para revisar. |
| 5 | Passo 4 | **Reserve um momento para revisar**\nRetome o que estudou e tente explicar sem consultar. Anote as dúvidas para orientar o próximo bloco. |
| 6 | CTA | **Salve para planejar a próxima semana**\nSua cola: escolha matérias, reserve blocos, inclua pausas e revise. Um plano pode ser ajustado conforme a semana acontece. |

### Observações de avaliação

- Qualidade: copy concreta, acolhedora, sem jargão, útil para o objetivo de salvamento; quatro ações pedidas estão presentes em ordem. As capas têm menos de 12 palavras e os títulos internos têm menos de oito. Os apoios dos slides de conteúdo ficam abaixo de 25 palavras.
- Coerência: seis slides exatos. CTA único de salvar, sem comentar, compartilhar ou seguir. Sem promessa de notas melhores e sem inventar marca, estudo, dado ou resultado. “4 passos” conta as quatro ações fornecidas pelo usuário, não é estatística.
- Problema observado: a skill combina “um passo por slide”, checklist no penúltimo, CTA no último e estrutura de passo a passo com erro comum. Com capa + quatro passos + CTA, seis slides já ficam ocupados. A resposta prioriza o escopo explícito e coloca a cola no último slide; deixa de seguir literalmente checklist no penúltimo e erro comum. Isso é uma tensão estrutural real, não falha de falta de informação. Não corrigi o repositório.
- Tempo proposto: não se aplica duração de vídeo; a copy não promete que o leitor concluirá o planejamento em um prazo arbitrário.
- Restrição: cumprida; não há HTML, PNG, legenda extra ou orientação de publicação na resposta ao prompt.

## Cenário E

Pedido: “Quero um vídeo vertical tipográfico de 25 segundos para Instagram sobre planejar a semana. Público: universitários. Tom direto, CTA comentar PLANO para receber um checklist que eu já tenho. Sem voz, sem música. Neste teste preciso apenas do roteiro e cenas.json que será usado para gerar o vídeo depois, não execute a renderização.”

Seleção: **nenhuma skill elegível pelas descrições**. A mais próxima é reel, mas o frontmatter diz expressamente “Use para vídeo pronto com texto animado; não para roteiro isolado”. O pedido atual limita a entrega a roteiro e JSON preparatório. Legenda cobre texto do post, não roteiro de cenas. Não li o corpo de reel para preservar o método de seleção solicitado. Entrego o texto autorizado como trabalho genérico, sem execução.

### Resposta completa ao prompt

Roteiro de 25 segundos, vertical e tipográfico. Sem voz e sem música. As transições acontecem dentro de cada cena.

| Tempo | Texto na tela | Movimento |
|---|---|---|
| 0–4 s | **Planeje sua semana.**\nComece pelos compromissos fixos. | Título entra suavemente; apoio aparece em seguida. |
| 4–8 s | **Escolha suas prioridades.**\nQuais matérias precisam de atenção? | Troca de texto com fade curto. |
| 8–12 s | **Reserve blocos de estudo.**\nDê uma tarefa para cada bloco. | Título entra; apoio surge abaixo. |
| 12–16 s | **Inclua pausas.**\nDeixe espaço entre os blocos. | Fade curto, mantendo o texto estável para leitura. |
| 16–20 s | **Separe tempo para revisar.**\nAnote as dúvidas que ficaram. | Título e apoio entram em sequência. |
| 20–25 s | **Comente PLANO**\npara receber o checklist. | PLANO ganha destaque; CTA permanece até o final. |

Conteúdo proposto para `cenas.json` — estrutura simples de planejamento; a compatibilidade deve ser confirmada com o renderizador que será usado depois:

```json
{
  "formato": "vertical_tipografico",
  "largura": 1080,
  "altura": 1920,
  "fps": 30,
  "duracao_segundos": 25,
  "publico": "universitarios",
  "tom": "direto",
  "audio": {
    "voz": false,
    "musica": false,
    "efeitos_sonoros": false
  },
  "estilo": {
    "fundo": "#101820",
    "texto": "#FFFFFF",
    "destaque": "#FFE082",
    "fonte": "sans-serif",
    "alinhamento": "centro"
  },
  "cenas": [
    {
      "id": 1,
      "inicio_segundos": 0,
      "duracao_segundos": 4,
      "titulo": "Planeje sua semana.",
      "apoio": "Comece pelos compromissos fixos.",
      "animacao": "fade_entrada",
      "entrada_segundos": 0.3
    },
    {
      "id": 2,
      "inicio_segundos": 4,
      "duracao_segundos": 4,
      "titulo": "Escolha suas prioridades.",
      "apoio": "Quais matérias precisam de atenção?",
      "animacao": "fade_entrada",
      "entrada_segundos": 0.3
    },
    {
      "id": 3,
      "inicio_segundos": 8,
      "duracao_segundos": 4,
      "titulo": "Reserve blocos de estudo.",
      "apoio": "Dê uma tarefa para cada bloco.",
      "animacao": "fade_entrada",
      "entrada_segundos": 0.3
    },
    {
      "id": 4,
      "inicio_segundos": 12,
      "duracao_segundos": 4,
      "titulo": "Inclua pausas.",
      "apoio": "Deixe espaço entre os blocos.",
      "animacao": "fade_entrada",
      "entrada_segundos": 0.3
    },
    {
      "id": 5,
      "inicio_segundos": 16,
      "duracao_segundos": 4,
      "titulo": "Separe tempo para revisar.",
      "apoio": "Anote as dúvidas que ficaram.",
      "animacao": "fade_entrada",
      "entrada_segundos": 0.3
    },
    {
      "id": 6,
      "inicio_segundos": 20,
      "duracao_segundos": 5,
      "titulo": "Comente PLANO",
      "apoio": "para receber o checklist.",
      "palavra_destaque": "PLANO",
      "animacao": "fade_entrada",
      "entrada_segundos": 0.3
    }
  ]
}
```

### Observações de avaliação

- Qualidade: roteiro direto, sequência clara e CTA único. O checklist já existe segundo o usuário; não inventei nome, conteúdo ou entrega automatizada. A chamada promete somente o recebimento solicitado.
- Coerência de tempo: cinco cenas de quatro segundos e uma de cinco somam exatamente 25 segundos. Inícios contíguos (0, 4, 8, 12, 16, 20), sem sobreposição nem lacuna. Entradas de 0,3 segundo incluídas no tempo das cenas. Textos curtos; a legibilidade visual não foi verificada porque não há render autorizado.
- Dados inventados: nenhum dado factual ou resultado. Resolução, fps, cores e animações são decisões propostas, explicitadas como planejamento. Esquema JSON próprio, sem afirmar compatibilidade com reel ou Remotion. Não foi possível avaliar o contrato real de cenas.json da skill sem contrariar a seleção baseada em descrição.
- Problema observado: a exclusão de roteiro isolado no frontmatter impede ativar reel neste teste preparatório. Isso reduz a cobertura deste pedido; não permite avaliar a implementação da skill reel. A avaliação registra o limite em vez de forçar seleção por palavras-chave.
- Revisão do próprio ensaio: corrigi acentos omitidos na primeira redação dos apoios do JSON de E. Esse problema era da resposta redigida, não evidência sobre uma skill cujo corpo não foi lido.
- Restrição: cumprida. JSON foi mostrado como texto, não salvo em cenas.json; não há MP4, áudio, renderização, instalação ou API.

## Cenário F

Pedido: “Crie e entregue um reel vertical tipográfico pronto em MP4 sobre planejar a semana. Público universitários, 25 segundos, tom direto, sem voz e sem música. CTA comentar PLANO para receber meu checklist.”

Seleção independente: **reel**. Agora a entrega solicitada é vídeo pronto tipográfico em MP4, exatamente o objeto do frontmatter. Li o corpo da skill após essa seleção e os utilitários de validação pertinentes. Este cenário foi executado depois de E; não muda retroativamente a decisão de fronteira registrada em E.

### Resposta completa ao prompt sob as restrições do ensaio

O roteiro e os dados para o reel estão preparados. O MP4 não foi gerado porque este ambiente de avaliação proíbe renderizar e instalar ferramentas.

Gancho: **Sua semana está sem plano?**

Texto contínuo para a legenda animada, sem narração: “Sua semana está sem plano? Comece pelos compromissos fixos e veja quais horários ficam livres. Escolha as matérias que precisam de atenção e defina uma tarefa por bloco. Inclua pausas entre os blocos para descansar antes de continuar. Reserve um momento para revisar e anote as dúvidas que ficaram. Comente PLANO para receber meu checklist e organizar sua semana.”

| Cena | Tempo | Tipo | Texto principal na tela | Fala/legenda |
|---|---|---|---|---|
| 1 | 0–2 s | gancho | Sua semana está sem plano? | Sua semana está sem plano? |
| 2 | 2–6 s | titulo | Comece pelos compromissos fixos | Comece pelos compromissos fixos e veja quais horários ficam livres. |
| 3 | 6–11 s | titulo | Escolha matérias e tarefas | Escolha as matérias que precisam de atenção e defina uma tarefa por bloco. |
| 4 | 11–15 s | titulo | Inclua pausas entre os blocos | Inclua pausas entre os blocos para descansar antes de continuar. |
| 5 | 15–20 s | titulo | Reserve tempo para revisar | Reserve um momento para revisar e anote as dúvidas que ficaram. |
| 6 | 20–25 s | cta | Comente PLANO / para receber meu checklist | Comente PLANO para receber meu checklist e organizar sua semana. |

`cenas.json` preparado no contrato descrito pela skill:

```json
{
  "cores": {
    "fundo": "#0E0F12",
    "texto": "#F4F4F2",
    "destaque": "#FFC94A",
    "suave": "#9A9CA3",
    "sobreDestaque": "#0E0F12"
  },
  "fonte": "sistema",
  "fonteItalica": "sistema",
  "legenda": true,
  "narracao": null,
  "palavras": null,
  "trilha": null,
  "cenas": [
    {
      "tipo": "gancho",
      "titulo": "Sua semana está sem plano?",
      "destaque": "sem plano",
      "fala": "Sua semana está sem plano?",
      "duracao": 2
    },
    {
      "tipo": "titulo",
      "titulo": "Comece pelos compromissos fixos",
      "subtitulo": "Veja os horários que ficam livres.",
      "fala": "Comece pelos compromissos fixos e veja quais horários ficam livres.",
      "duracao": 4
    },
    {
      "tipo": "titulo",
      "titulo": "Escolha matérias e tarefas",
      "subtitulo": "Uma tarefa para cada bloco.",
      "fala": "Escolha as matérias que precisam de atenção e defina uma tarefa por bloco.",
      "duracao": 5
    },
    {
      "tipo": "titulo",
      "titulo": "Inclua pausas entre os blocos",
      "subtitulo": "Descanse antes de continuar.",
      "fala": "Inclua pausas entre os blocos para descansar antes de continuar.",
      "duracao": 4
    },
    {
      "tipo": "titulo",
      "titulo": "Reserve tempo para revisar",
      "subtitulo": "Anote as dúvidas que ficaram.",
      "fala": "Reserve um momento para revisar e anote as dúvidas que ficaram.",
      "duracao": 5
    },
    {
      "tipo": "cta",
      "chamada": "Comente",
      "palavra": "PLANO",
      "promessa": "para receber meu checklist",
      "fala": "Comente PLANO para receber meu checklist e organizar sua semana.",
      "duracao": 5
    }
  ]
}
```

Legenda sugerida: “Dê uma tarefa a cada bloco de estudo e deixe espaço para pausas e revisão. Comente PLANO para receber meu checklist.”

### Observações de avaliação

- Qualidade: sequência útil, concreta, tom direto e CTA consistente com o material existente do usuário. Nenhuma estatística, promessa de nota, marca ou resultado inventado.
- Coerência: seis cenas, uma ideia central por cena. O campo fala é obrigatório no contrato mesmo sem áudio; aqui fornece a legenda visual, não uma autorização para narrar. narracao e trilha null preservam o pedido sem voz e sem música. Fontes de sistema evitam escolha que exija download posterior.
- Tempo: durações explícitas 2 + 4 + 5 + 4 + 5 + 5 = 25 segundos; gancho de 2 segundos, demais cenas abaixo de 6. Não foram feitas medições visuais nem de vídeo, pois render é proibido.
- Limitação: entrega de MP4 permanece incompleta por restrição expressa do ensaio. Não há caminho de MP4 inventado nem afirmação de exportação concluída. Esse limite vem da tarefa de avaliação, não de uma exigência de autorização da skill.
- Problemas observados no corpo: “Última cena ... a fala diz a palavra em voz alta” e checklist “na tela e na fala” não distinguem claramente o caso sem voz; o contrato funciona mantendo fala como texto da legenda, mas a linguagem pode gerar dúvida. “Nada parado mais de ~3 s” é ilustrado com cenas de até 6 s e o validador aceita até 6,5 s para não-listas; o ensaio não verificou esse critério por imagem. Essas observações não são prova de defeito do renderizador.

- Verificação efetivamente executada em F: `node skills/reel/scripts/checar.mjs --projeto <pasta de ensaio fora do repo>`. Exit code 0; duração 25,0 s, gancho 2,0 s e CTA PLANO. Contrastes medidos: texto/fundo 17,4:1; destaque/fundo 12,5:1; sobreDestaque/destaque 12,5:1; suave/fundo 7,0:1. Avisos somente de ausência de narração e trilha, compatíveis com o pedido. “Pronto para renderizar” é a mensagem do validador, não confirmação de renderização. O JSON temporário de validação ficou em work/avaliacao-reel-f/cenas.json, fora do repositório avaliado.

# Segunda rodada: skills revisadas, cenários D e F

Relidas somente carrossel e reel por solicitação explícita. As respostas abaixo foram redigidas novamente a partir dos prompts e dos corpos revisados, sem consultar o relatório anterior durante a redação. A memória do ensaio existe no histórico do agente; isto não equivale a um teste cego com contexto novo. Todo o conteúdo anterior permanece preservado.

## D: nova resposta

Skill escolhida: carrossel, pela entrega de copy para um post de seis imagens. Formato: passo a passo, porque as ações formam uma sequência de planejamento.

Três capas:

1. **4 passos para organizar sua semana de estudos** — recomendada: apresenta com clareza o processo que o post entrega.
2. **Sua semana de estudos precisa de espaço**
3. **Pare de planejar estudos sem considerar sua rotina**

| Slide | Tipo | Copy |
|---|---|---|
| 1 | Capa | **4 passos para organizar sua semana de estudos**\nUm plano que respeite sua rotina. Arrasta para o lado. |
| 2 | Escolha | **1. Escolha as matérias**\nConfira entregas e provas. Priorize o que precisa de atenção nesta semana. Depois, encontre tempo para cada tarefa. |
| 3 | Blocos | **2. Reserve blocos de estudo**\nComece pelas aulas e compromissos. Nos espaços livres, marque tarefas específicas, como revisar anotações. Deixe espaço para respirar. |
| 4 | Pausas | **3. Planeje as pausas**\nReserve intervalos entre os blocos. Evite ocupar cada horário livre com estudo. E como retomar o que aprendeu? |
| 5 | Revisão | **4. Inclua a revisão**\nReserve um bloco para explicar os conteúdos sem consultar. Anote onde travou para escolher o que retomar. Sua semana pode ser ajustada. |
| 6 | Checklist e CTA | **Salve para planejar sua próxima semana**\n□ Escolher matérias\n□ Reservar blocos\n□ Incluir pausas\n□ Revisar conteúdos |

### Avaliação observável de D

- Seis slides exatos; cada uma das quatro ações ocupa um slide; último combina checklist de quatro linhas e um único CTA de salvar.
- A instrução nova autoriza explicitamente combinar resumo e CTA no último slide quando a quantidade fixa não comporta ambos separados. O roteiro aplicou essa exceção sem pedir confirmação ou adicionar slide.
- Três capas com menos de 12 palavras; títulos internos menores que oito palavras; apoios de conteúdo abaixo de 25 palavras. Linguagem acolhedora, sem prometer notas melhores. “4” é contagem de ações, não dado empírico inventado.
- Não há arquivos de mídia, HTML, legenda extra, publicação ou marca inventada. Só o registro autorizado deste ensaio foi escrito.
- A tabela de formato passo a passo ainda cita “erro comum a evitar”, mas não indica claramente se deve ser slide separado. Aqui a orientação “evite ocupar cada horário livre” no slide de pausas contempla um erro sem impor outra imagem.
- Tempo de leitura/layout não medido: não houve renderização, por restrição do teste.

## F: nova resposta

Skill escolhida: reel, pois o pedido solicita MP4 tipográfico pronto. O vídeo não foi renderizado porque o ensaio proíbe renderização e instalação. Segue o material preparatório, sem afirmar entrega de MP4.

Gancho: **A semana começou. E seu plano?**

Texto corrido para a legenda, sem voz: “A semana começou. E seu plano? Liste suas aulas, compromissos e entregas antes de marcar horários de estudo. Escolha uma matéria e uma tarefa para cada bloco disponível. Deixe pausas entre os blocos para descansar e reorganizar o ritmo. No fim da semana, revise os conteúdos e anote o que precisa retomar. Comente PLANO para receber meu checklist e preparar sua próxima semana.”

| Cena | Tempo | Tipo | Tela | Fala, usada como legenda visual |
|---|---|---|---|---|
| 1 | 0–2 s | gancho | A semana começou. E seu plano? | A semana começou. E seu plano? |
| 2 | 2–7 s | titulo | Primeiro, os compromissos | Liste suas aulas, compromissos e entregas antes de marcar horários de estudo. |
| 3 | 7–11 s | titulo | Um bloco, uma tarefa | Escolha uma matéria e uma tarefa para cada bloco disponível. |
| 4 | 11–15 s | titulo | Pausas também entram no plano | Deixe pausas entre os blocos para descansar e reorganizar o ritmo. |
| 5 | 15–20 s | titulo | Reserve espaço para revisar | No fim da semana, revise os conteúdos e anote o que precisa retomar. |
| 6 | 20–25 s | cta | Comente PLANO / para receber meu checklist | Comente PLANO para receber meu checklist e preparar sua próxima semana. |

```json
{
  "cores": {"fundo":"#0E0F12","texto":"#F4F4F2","destaque":"#FFC94A","suave":"#9A9CA3","sobreDestaque":"#0E0F12"},
  "fonte": "sistema",
  "fonteItalica": "sistema",
  "legenda": true,
  "narracao": null,
  "palavras": null,
  "trilha": null,
  "cenas": [
    {"tipo":"gancho","titulo":"A semana começou. E seu plano?","destaque":"seu plano","fala":"A semana começou. E seu plano?","duracao":2},
    {"tipo":"titulo","titulo":"Primeiro, os compromissos","subtitulo":"Aulas, compromissos e entregas.","fala":"Liste suas aulas, compromissos e entregas antes de marcar horários de estudo.","duracao":5},
    {"tipo":"titulo","titulo":"Um bloco, uma tarefa","subtitulo":"Escolha a matéria e o que estudar.","fala":"Escolha uma matéria e uma tarefa para cada bloco disponível.","duracao":4},
    {"tipo":"titulo","titulo":"Pausas também entram no plano","subtitulo":"Deixe espaço entre os blocos.","fala":"Deixe pausas entre os blocos para descansar e reorganizar o ritmo.","duracao":4},
    {"tipo":"titulo","titulo":"Reserve espaço para revisar","subtitulo":"Anote o que precisa retomar.","fala":"No fim da semana, revise os conteúdos e anote o que precisa retomar.","duracao":5},
    {"tipo":"cta","chamada":"Comente","palavra":"PLANO","promessa":"para receber meu checklist","fala":"Comente PLANO para receber meu checklist e preparar sua próxima semana.","duracao":5}
  ]
}
```

Legenda sugerida: “Coloque compromissos, tarefas, pausas e revisão no seu planejamento. Comente PLANO para receber meu checklist.”

### Avaliação observável de F

- Seis cenas; duração proposta 2 + 5 + 4 + 4 + 5 + 5 = 25 segundos. Gancho de seis palavras, aparece inteiro no campo titulo. Texto e palavra PLANO coerentes entre roteiro e JSON.
- Nenhuma estatística ou promessa de resultado; o checklist foi informado no pedido. Cores e fonte são escolhas de execução, não fatos inventados sobre o usuário.
- A nova explicação da skill esclarece expressamente que fala continua obrigatório sem narração como texto de legenda e estimativa de tempo. O JSON usa fala e legenda true, mantendo narracao e trilha null; não pede chave nem autorização de crédito desnecessária.
- Roteiro, campo fala e JSON estão acentuados; CTA único de comentar. Sem narração, música ou efeitos sonoros produzidos.
- Sem MP4, prévias ou prova visual: limite do ensaio. Não há alegação de qualidade visual, sincronização medida ou exportação concluída.
- A instrução “Nada parado mais de ~3 s” ainda não se comprova pela duração das cenas; dependeria de observar a animação. Os tempos abaixo de seis segundos são verificáveis, mas não bastam para concluir cumprimento visual.
- Verificação executada nesta segunda rodada: checar.mjs com JSON em work/avaliacao-reel-f-rodada2/cenas.json, fora do repo. Exit 0; 25,0 s; gancho 2,0 s; CTA Comente PLANO. Contrastes aprovados: texto/fundo 17,4:1, destaque/fundo 12,5:1, sobreDestaque/destaque 12,5:1, suave/fundo 7,0:1. Somente avisos de ausência de narração e trilha. A mensagem do utilitário “Pronto para renderizar” não significa que um render tenha sido executado.
