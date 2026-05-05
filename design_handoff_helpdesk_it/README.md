# Handoff: Tropigas PR — Mesa de Ayuda IT (UCG)

## Overview
Internal IT helpdesk system for **Tropigas Puerto Rico**. Tropigas employees (administración, sucursales) report IT issues to **UCG**'s Mesa de Ayuda team. UCG technicians triage, assign, resolve, document, and report on those tickets. The system covers the full lifecycle from "I can't print my invoice" all the way to monthly SLA reporting for management.

This is **not** customer-facing. The audience is:
- **Empleados Tropigas** (one self-service portal screen)
- **UCG IT team** (six operational screens)

## About the Design Files
The files in `design/` are **HTML design references** — high-fidelity prototypes showing the intended look, density, copy, and behavior. They are NOT production code.

Your task is to **recreate these designs in the target codebase's existing environment** (likely React/Vue/Angular + a real backend) using its established patterns, component libraries, state management, and routing. If no app environment exists yet, pick the most appropriate framework and implement there.

The HTML files are reference for:
- Pixel-level layout, spacing, density
- Exact colors, typography, copy, iconography
- Component composition and information hierarchy
- Interaction states (hover, active, selected, validation)

## Fidelity
**High-fidelity (hifi).** All colors, typography, spacing, and copy in the prototypes are intended to be implemented as designed. Recreate pixel-perfectly using the codebase's existing styling solution (CSS modules, Tailwind, styled-components, etc.).

## Language
All UI copy is **Spanish (es-PR)**. Some terms intentionally mix Spanish + technical English (e.g. "Reset de contraseña", "Active Directory", "VPN"). Keep this — that's how the team actually talks.

## Files in `design/`

| File | Purpose |
|---|---|
| `colors_and_type.css` | All design tokens (colors, fonts, spacing, radii, shadows). Imports Source Serif 4, Inter, JetBrains Mono from Google Fonts. |
| `DESIGN_SYSTEM.md` | Full design system documentation: brand context, voice/tone, content patterns, component inventory. |
| `helpdesk/_helpdesk-shared.css` | Shared chrome styles for all helpdesk screens (top bar, tabs, footer, buttons, form primitives, status pills). |
| `helpdesk/README.md` | UI kit notes for the helpdesk subsystem. |
| `helpdesk/Helpdesk Screens.html` | **Screen 1+2 combined** — Empleado portal (create ticket) + Mis Tickets (employee history). |
| `helpdesk/pages/dashboard.html` | UCG IT operational pulse: cola, SLA, alertas, asignaciones recientes. |
| `helpdesk/pages/tickets.html` | Full ticket queue table: filters, search, bulk actions, sortable columns. |
| `helpdesk/pages/asignar.html` | Assignment workspace: unassigned queue + technician load + auto-rules. |
| `helpdesk/pages/ticket-detail.html` | Single ticket: Conversación / Solución / Bitácora / Activo / Relacionados tabs + side rail (SLA, asignado, empleado, KB). |
| `helpdesk/pages/kb.html` | Knowledge Base: 3-column (categories / list / preview). |
| `helpdesk/pages/reportes.html` | Management reports: KPIs, daily volume chart, SLA donut, category bars, technician leaderboard, branch load, KB usage, recurring patterns. |
| `assets/tropigas-logo*.png` | Brand logos (white-on-transparent; sample on navy/red backgrounds). |

## Screens

### 1. Portal del Empleado (employee-facing)
**File:** `helpdesk/Helpdesk Screens.html` (first screen)

**Purpose:** A Tropigas employee at any sucursal/oficina reports an IT problem to UCG.

**Layout:** Single-column form, centered ~720px wide, on `--paper-2` background. Hero with serif headline "¿Necesitas ayuda?" + subtitle. Numbered sections (01 Problema, 02 Equipo afectado, 03 Importancia). Submit row at bottom.

**Key components:**
- Hero: `Source Serif 4 600 32px`, sub `Inter 14px ink-3`.
- Section headers: numbered `01` in `JetBrains Mono` `tg-red`.
- Form fields: see `_helpdesk-shared.css` `input/select/textarea`.
- Importance picker: 3 segmented options (Alta / Media / Baja) with colored swatches.
- Right sidebar (smaller): SLA expectations + "Mis tickets recientes" mini-list.

### 2. Mis Tickets (employee-facing)
**Same file** — toggle screens via the dev nav at bottom.

**Purpose:** Employee sees status of their reported tickets and can re-open the detail.

### 3. Dashboard IT (UCG)
**File:** `helpdesk/pages/dashboard.html`

**Purpose:** UCG technician's first view on shift — what needs attention now.

**Layout:** 3-row grid: KPI strip (5 cards) → Cola activa table (8 cols) + Alerts column → Asignaciones recientes feed.

**Key components:**
- KPI cards: serif numerator (28px), tiny uppercase label, trend arrow with delta.
- Cola table: importance pill (left border 3px), status pill (dot + uppercase), age badge that turns red after SLA threshold.
- Alert cards: red-left-border for critical, amber for warning, blue for info.

### 4. Gestión de Tickets (UCG)
**File:** `helpdesk/pages/tickets.html`

**Purpose:** Full ticket queue with power-user filtering.

**Layout:** Filter bar (top) → Bulk action bar (appears on selection) → Wide table.

**Columns:** checkbox | ID | Resumen | Empleado | Categoría | Importancia | Estado | Asignado | SLA | Edad | menu.

### 5. Asignar (UCG supervisor)
**File:** `helpdesk/pages/asignar.html`

**Purpose:** Distribute unassigned tickets across the team based on load + skill.

**Layout:** 2-column. Left: cola sin asignar as selectable cards. Right: technician panel with load bars + assignment rules.

### 6. Detalle de Ticket (UCG)
**File:** `helpdesk/pages/ticket-detail.html`

**Purpose:** Working surface for resolving a single ticket.

**Layout:** Banner (ID, title, meta, actions) → Detail tabs → 2-column body (main pane + 320px right rail).

**Tabs:**
- **Conversación** — threaded messages (employee, IT public reply, internal note, system event), composer at bottom with mode toggle (Mensaje / Nota interna / Plantilla KB).
- **Solución** — diagnostic dropdowns, numbered steps with check marks, employee verification card, closing summary that gets sent to the employee on resolve.
- **Bitácora** — full audit log table with filterable event types (Mensaje / Estado / Asignación / Sistema / SLA).
- **Activo** — equipment record (HP-LJ-204): manufacturer, model, serial, IP, warranty, ticket history.
- **Relacionados** — same-employee or same-pattern tickets.

**Right rail:** SLA gauge, asignado, empleado info, top KB suggestions, etiquetas.

### 7. Base de Conocimiento (UCG)
**File:** `helpdesk/pages/kb.html`

**Purpose:** Reference articles documented from past tickets.

**Layout:** 3-column. Categories (260px) | Article list (flex) | Article preview (380px).

**Article preview structure:** Síntomas (amber callout) → Causa raíz → Solución (numbered steps) → Prevención → Uso del artículo (4 stat cards) → Tickets relacionados.

### 8. Reportes (UCG → gerencia)
**File:** `helpdesk/pages/reportes.html`

**Purpose:** Monthly operational + management reporting.

**Sections (top to bottom):**
1. KPI strip (5): Tickets 30d, SLA cumplimiento, MTTR, CSAT, % resueltos en 1ra respuesta.
2. Volumen diario chart (SVG line) + SLA donut.
3. Categorías bar chart + Equipo de IT leaderboard.
4. Carga por sucursal (4 cards with stacked-segment bars) + Top 6 KB.
5. Patrones recurrentes (3 alert cards: red/amber/blue).

## Design Tokens (from `colors_and_type.css`)

### Brand colors
- `--tg-navy`: `#1C2F5C` (primary brand, top bar, primary buttons)
- `--tg-navy-deep`: `#16264C` (hover/pressed)
- `--tg-red`: `#E30512` (Puerto Rico red, accent, danger, importance Alta)
- `--tg-red-dark`: `#B0040E`
- `--tg-red-soft`: `#FCE4E6` (importance Alta background)

### Neutrals
- `--paper`: `#FFFFFF`
- `--paper-2`: `#F4F5F7` (app canvas)
- `--paper-3`: `#E9ECEF`
- `--ink`: `#0F172A` (primary text)
- `--ink-2`: `#1F2937`
- `--ink-3`: `#4B5563`
- `--ink-4`: `#6B7280` (secondary text, meta)
- `--ink-5`: `#9CA3AF`
- `--line`: `#E5E7EB`
- `--line-soft`: `#F3F4F6`

### Importance / Status
- `--imp-alta-bg`: `#FCE4E6` / `--imp-alta-fg`: `#9F1239`
- `--imp-media-bg`: `#FEF3C7` / `--imp-media-fg`: `#92400E`
- `--imp-baja-bg`: `#DBEAFE` / `--imp-baja-fg`: `#1E40AF`
- `--st-new`: `#3B82F6` (Recibido)
- `--st-prog`: `#F59E0B` (En progreso)
- `--st-done`: `#10B981` (Resuelto)
- `--st-closed`: `#6B7280` (Cerrado)

### Typography
- `--font-display`: `'Source Serif 4', Georgia, serif` — page titles, KPI numerators, hero headlines
- `--font-ui`: `'Inter', system-ui, sans-serif` — all UI text, body, forms, buttons
- `--font-mono`: `'JetBrains Mono', 'Source Code Pro', monospace` — IDs (SM-00043), timestamps, KPIs, technical values, footer

### Scale (from prototypes)
- Page H1: 22-24px serif 600
- Section H4: 11px Inter 600 uppercase 0.10em letter-spacing, color `--tg-navy`
- Body: 12-13px Inter
- Meta/labels: 10-11px Inter `--ink-4` letter-spacing 0.05-0.10em uppercase

### Radii
- `3px` for buttons, inputs, chips, status pills (intentionally tight — enterprise feel)
- `4px` for panels/cards
- `50%` for avatars and donut

### Shadows
- `--shadow-1`: `0 1px 2px rgba(15, 23, 42, 0.04)` — cards
- `--shadow-2`: `0 2px 6px rgba(15, 23, 42, 0.08)` — elevated/hover

## Interactions & Behavior

### Navigation (top tabs)
The top tab bar `[01]…[05]` is the primary navigation between IT screens. The active tab gets `--tg-navy` background, white text, 3px `--tg-red` underline.

### Ticket lifecycle states
`Recibido` → `En progreso` → `Resuelto` → `Cerrado`. Status pill is a colored dot + uppercase label, color matches `--st-*` token.

### SLA visualization
Time-based progress bar (green / amber / red as time elapses vs. budget). Show as `Xh Ym / 4h Alta` with mono font.

### Composer modes (ticket detail)
Toggle between **Mensaje a empleado** (default, navy chip) and **Nota interna** (amber chip). The textarea + Enviar button stays the same; only the styling and the recipient change.

### Bulk actions (tickets queue, asignar)
Show the action bar only when at least one row is selected. Counter ("2 seleccionados") + actions (Cambiar importancia / Mover a equipo / Asignar a / Cerrar masivo).

### Detail tabs
Within ticket-detail.html, tabs switch panes via JS (`showTab(id)`). Active tab gets bottom border in `--tg-red`.

### Form validation
Required fields marked with `<span class="req">*</span>` in the label. Error states: red border + red 11px helper text below. OK states: subtle green check at right edge.

## State Management
Variables a real implementation needs:

- **Auth**: current user (employee vs. UCG IT) — drives whether to show employee portal or IT console.
- **Tickets**: array with `id, summary, employee, category, importance, status, assignee, slaTarget, createdAt, updatedAt, asset`.
- **Selection**: which tickets are checked in bulk views.
- **Filters**: queue filters (importancia, estado, sucursal, asignado, fecha).
- **Detail tab**: current active tab in ticket detail.
- **Composer**: mode (public/internal), draft body, attachments.
- **KB**: articles, current category, current article, search query.
- **Reportes**: date range, exported format.

## Assets
- `assets/tropigas-logo.png` — original (white, transparent bg)
- `assets/tropigas-logo-on-navy.png` — preview rendered on navy
- All other "imagery" in the prototypes is HTML/CSS/SVG (PR flag glyph, donut, line chart, bar charts) — no external image dependencies in the chrome.

## Implementation Notes

### Fonts
Already loaded via `@import` in `colors_and_type.css` from Google Fonts. In a real build, prefer self-hosting or the framework's font solution (e.g. `next/font`).

### CSS approach
Tokens are CSS custom properties. Components in the prototypes use a mix of utility classes (`.btn`, `.btn.primary`, `.imp-Alta`, `.stat-Progreso`) and component-scoped styles. Pick whichever pattern matches the target codebase — the tokens are what matters.

### Responsive
The prototypes are designed for **1440×900 desktop** (UCG technicians on workstations). The Empleado portal should also work well on tablet/mobile (it's a simpler form). The IT console screens (Dashboard / Tickets / Asignar / Detalle / KB / Reportes) are explicitly desktop-first; on smaller screens they should either stack columns or show a "Open on desktop" message.

### Accessibility
- All status info uses both color **and** a pill/text label (don't break for color-blind users).
- Keep `font-size` ≥ 11px in actual UI; smaller is for fine print only.
- All interactive elements need visible focus states (defined in `_helpdesk-shared.css` via `:focus { box-shadow: 0 0 0 2px rgba(28, 47, 92, 0.18); }`).

### Spanish (es-PR)
Use `lang="es-PR"` on `<html>`. Date format: `DD MMM YYYY` (e.g. `04 may 2026`). Time: 24h with AST timezone (`14:32 AST`).

---

**Questions during implementation?** Reference the live HTML in `design/`. Any visual decision not documented here is captured in code.
