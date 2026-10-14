# Instala as cinco skills no Codex do usuario atual (Windows PowerShell 5.1+).
# Executar: powershell -ExecutionPolicy Bypass -File .\scripts\instalar-codex.ps1
[CmdletBinding()]
param(
  [string]$Destino = (Join-Path $HOME ".agents\skills")
)
$ErrorActionPreference = "Stop"
$nomes = @("reel", "carrossel", "legenda", "perfil", "comentarios")
$raiz = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$origem = Join-Path $raiz "skills"
if (-not (Test-Path (Join-Path $origem "reel\SKILL.md"))) {
  throw "Pasta skills nao encontrada. Clone ou extraia primeiro o repositorio completo."
}
New-Item -ItemType Directory -Force -Path $Destino | Out-Null
foreach ($nome in $nomes) {
  $fonte = Join-Path $origem $nome
  $alvo = Join-Path $Destino $nome
  $manifesto = Join-Path $fonte "SKILL.md"
  if (-not (Test-Path $manifesto)) { throw "Manifesto ausente: $manifesto" }
  $texto = Get-Content -LiteralPath $manifesto -Raw -Encoding UTF8
  if ($texto -notmatch '(?s)^---\r?\n(.*?)\r?\n---') { throw "Frontmatter ausente: $manifesto" }
  $cabecalho = $Matches[1]
  if ($cabecalho -notmatch '(?m)^name:\s*\S+' -or $cabecalho -notmatch '(?m)^description:\s*\S+') {
    throw "Frontmatter invalido: $manifesto"
  }
  if (Test-Path $alvo) { Remove-Item -LiteralPath $alvo -Recurse -Force }
  Copy-Item -LiteralPath $fonte -Destination $alvo -Recurse -Force
  Write-Host "[OK] $nome -> $alvo"
}
Write-Host "Instalacao concluida. Reinicie o Codex para descobrir as cinco skills."
Write-Host 'Teste com: Use a skill $legenda para criar uma legenda de Instagram.'
