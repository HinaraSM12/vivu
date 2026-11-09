#Requires -Version 5.1
<#
.SYNOPSIS
  Configura la gobernanza de GitHub para HinaraSM12/vivu:
  1. Protege la rama `main` exigiendo Pull Request y los 3 checks de CI en verde.
  2. Activa vulnerabilidades/Dependabot si la cuenta tiene permisos de administración.
  3. Crea los Issues base para los Sprints 1 a 9.

.NOTES
  Requiere estar autenticado en GitHub CLI (`gh auth login`) con la cuenta propietaria `HinaraSM12`.
#>

param(
  [string]$Repo = "HinaraSM12/vivu",
  [switch]$SkipBranchProtection,
  [switch]$SkipIssues
)

$ErrorActionPreference = "Stop"

Write-Host "== Verificando acceso a $Repo ==" -ForegroundColor Cyan
$perm = gh repo view $Repo --json viewerPermission -q ".viewerPermission"
if ($perm -ne "ADMIN" -and $perm -ne "WRITE" -and $perm -ne "MAINTAIN") {
  Write-Warning "La sesión actual de 'gh' tiene permiso '$perm' sobre $Repo (se requiere 'WRITE' o 'ADMIN')."
  exit 1
}

if (-not $SkipBranchProtection) {
  if ($perm -ne "ADMIN") {
    Write-Warning "La sesión actual tiene permiso '$perm' (no 'ADMIN'). La protección de rama 'main' vía API requiere rol Admin en GitHub."
    Write-Warning "Omitiendo protección de rama y continuando con etiquetas e Issues..."
  } else {
    Write-Host "== Aplicando protección a la rama 'main' en $Repo ==" -ForegroundColor Cyan
    $protectionPayload = @{
      required_status_checks = @{
        strict   = $true
        contexts = @(
          "Calidad Node y TypeScript",
          "Calidad Python",
          "Contrato de Docker Compose"
        )
      }
      enforce_admins                  = $true
      required_pull_request_reviews   = @{
        dismiss_stale_reviews           = $true
        require_code_owner_reviews      = $false
        required_approving_review_count = 0
      }
      restrictions                    = $null
      required_linear_history         = $false
      allow_force_pushes              = $false
      allow_deletions                 = $false
      required_conversation_resolution = $true
    } | ConvertTo-Json -Depth 6

    $protectionPayload | gh api --method PUT "repos/$Repo/branches/main/protection" --input - | Out-Null
    Write-Host "✔ Rama 'main' protegida (PR obligatorio + CI verde + sin force push)." -ForegroundColor Green

    Write-Host "== Activando alertas de vulnerabilidad (Dependabot) ==" -ForegroundColor Cyan
    gh api --method PUT "repos/$Repo/vulnerability-alerts" | Out-Null
    gh api --method PUT "repos/$Repo/automated-security-fixes" | Out-Null
    Write-Host "✔ Alertas de vulnerabilidad y parches automáticos de Dependabot activados." -ForegroundColor Green
  }
}

if (-not $SkipIssues) {
  Write-Host "== Creando etiquetas e Issues para Sprints 1 a 9 ==" -ForegroundColor Cyan
  gh label create "sprint" --color "5B5BD6" --description "Entrega principal de Sprint" --repo $Repo --force | Out-Null

  $sprints = @(
    @{ Number = 1; Title = "[Sprint 1] Identidad y acceso"; Body = "Registro exclusivo STUDENT, login/logout, sesiones JWT + refresh rotativo, RBAC (`STUDENT`, `FACILITATOR`, `ADMIN`), protección de rutas y preparación de sesión offline futura.`n`nReferencias: `PB-005`, `PB-006`, `STU-01`, `STU-02`." },
    @{ Number = 2; Title = "[Sprint 2] Consentimiento, onboarding y perfil"; Body = "Consentimiento informado versionado, flujo de retiro, wizard de onboarding paso a paso, perfil editable en `student-service` y eventos.`n`nReferencias: `PB-007`, `PB-008`, `PB-031`, `STU-03..08`, `STU-19`, `STU-20`." },
    @{ Number = 3; Title = "[Sprint 3] Misiones, ludificación y progreso"; Body = "Catálogo de misiones, aceptación, finalización, progreso personal, logros no competitivos, continuidad semanal y eventos en `gamification-service`.`n`nReferencias: `PB-009..012`, `STU-09..14`." },
    @{ Number = 4; Title = "[Sprint 4] Recursos, microcuestionarios y recuperación"; Body = "Catálogo de recursos institucionales autorizados (`resource-service`), microcuestionarios breves (`survey-service`), modo recuperación sin castigo y metas mínimas viables.`n`nReferencias: `PB-013`, `PB-014`, `PB-026`, `STU-15`, `STU-17`, `STU-18`." },
    @{ Number = 5; Title = "[Sprint 5] Recomendador V1 online"; Body = "Construcción de `RecommendationContext`, hard rules de elegibilidad, scoring determinístico en `recommendation-service` (Python + FastAPI), `LLMProvider` opcional con fallback y trazabilidad.`n`nReferencias: `PB-015..020`, `STU-16`." },
    @{ Number = 6; Title = "[Sprint 6] PWA local-first y sincronización offline"; Body = "Service Worker (`vite-plugin-pwa`), `IndexedDB` (`idb`), `Outbox`, `Sync Engine`, idempotencia con `clientEventId`, resolución de conflictos por dominio, recomendador determinístico offline en TypeScript (`OFFLINE_RULES`) y fixtures de paridad Python/TS.`n`nReferencias: `PB-043..053`, `ADR-005`, `STU-21`." },
    @{ Number = 7; Title = "[Sprint 7] Facilitador (`support-service`)"; Body = "Asignaciones facilitador-estudiante, listado de asignados, señales de continuidad sin etiquetas de riesgo, notas de acompañamiento y compromisos.`n`nReferencias: `PB-021..023`, `FAC-01..05`." },
    @{ Number = 8; Title = "[Sprint 8] Administración"; Body = "Gestión de usuarios/roles, asignaciones, catálogos de misiones/recursos/encuestas, configuración versionada de reglas y recomendador, auditoría y exportaciones anonimizadas.`n`nReferencias: `PB-024`, `PB-025`, `PB-030`, `PB-032`, `ADM-01..12`." },
    @{ Number = 9; Title = "[Sprint 9] Analítica y preparación del piloto"; Body = "`analytics-service`, métricas longitudinales (semanas 1, 4 y 10), suite E2E completa con Playwright, accesibilidad WCAG AA, hardening y validación de instrumentos del piloto.`n`nReferencias: `PB-028`, `PB-029`, `PB-033..039`." }
  )

  foreach ($s in $sprints) {
    gh issue create --repo $Repo --title $s.Title --body $s.Body --label "sprint"
  }
  Write-Host "✔ Issues de Sprints 1 a 9 creados." -ForegroundColor Green
}

