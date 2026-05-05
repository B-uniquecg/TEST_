# Tropigas PR — Design System

Design system for **Tropigas Puerto Rico**'s internal IT helpdesk / Mesa de Ayuda
(branded **Portal Operativo · UCG**). The single product surface today is a
ticket-management web app where the company's customer-service operators (UCG)
log, triage, and resolve incoming issues from the propane-distribution business —
fuga de gas, reposición de cilindro, mantenimiento de generador, facturación, etc.

The visual language is **utility-first, dense, and operational**. It mixes the
bold serif wordmark and red/navy/PR-flag identity from the public marketing site
(tropigaspuertorico.com) with a Bloomberg-terminal-flavored UI: tabular numerals,
eyebrow micro-labels, hairline rules, sticky tables, pill status tags. Tropigas
is a 60+ year propane company with 20+ service plants across the island; the tone
is **bilingual Spanish-PR-leaning, professional, no-nonsense**.

---

## Sources

| Source                                 | What's there                                            | Access                                  |
|----------------------------------------|---------------------------------------------------------|-----------------------------------------|
| Local mount `TropiGas/`                | The full helpdesk app — `tickets-tropigas.html` (3.1k lines), `server.js`, `package.json`. The single-file HTML is the canonical reference for tokens, components, and copy. | Mounted via Import; reattach if missing |
| GitHub `B-uniquecg/TEST_`              | Same files as the local mount, public mirror.           | Public                                  |
| `tropigaspuertorico.com/nuestras-plantas` | Marketing site — pulled the white-on-navy wordmark and three plant photos for brand reference. | Public                            |

The product code is **vanilla HTML + inline CSS + plain JS**, no framework, no
build. Tickets are persisted to `localStorage` under key `tropigas_pr_v3`.

---

## Index

```
.
├── README.md                 ← you are here
├── SKILL.md                  ← Agent-Skills entry point
├── colors_and_type.css       ← CSS vars (colors, type, spacing, radius, shadow)
├── fonts/                    ← (Google Fonts CDN; no local TTF — see "Type" below)
├── assets/
│   ├── tropigas-logo.png         (white-on-transparent, 1500×310, from marketing site)
│   ├── tropigas-logo-on-navy.png (preview against navy)
│   ├── tropigas-logo-on-red.png  (preview against red)
│   ├── plant-01.jpg / plant-02.jpg / plant-03.jpg  (operational photos)
├── preview/                  ← cards rendered in the Design System tab
└── ui_kits/
    └── helpdesk/             ← the IT Mesa de Ayuda kit (Dashboard, Tickets, Detail, Modal)
```

---

## Content Fundamentals

The product is **Spanish (es-PR)** with English creeping in at the data layer
(`SF`, `EMAS`, `SLA`). Tone is **operative, terse, second-person-implicit**.

- **Language:** Spanish, Puerto Rico register. `<html lang="es-PR">`. No "tú/usted"
  ambiguity — almost no second-person at all. Copy speaks **about** tickets, not
  **to** the user. ("Sin atender", "En curso", "Cerrados hoy" — never "Tú tienes
  3 tickets sin atender").
- **Casing:**
  - **UPPERCASE** for eyebrows, tab labels, section titles, status tags, and the
    statusbar. (`SISTEMA`, `HORA AST`, `RECIBIDO`, `CONECTADO`).
  - **Sentence case** for body labels and field names (`No. Salesforce`,
    `Tipo de cuenta`, `Razón breve`).
  - **Title Case** never used.
- **Voice:** Operator voice. Imperative section labels (`Información del ticket`,
  `Datos del cliente`, `Problema reportado`, `Asignación`). Buttons are bare verbs
  in uppercase: `NUEVO TICKET`, `EDITAR`, `ELIMINAR`, `GUARDAR REGISTRO`,
  `CANCELAR`.
- **Numbering:** Forms use bracketed step numbers in tabs (`[01] Dashboard`,
  `[02] Gestión de Tickets`, `[A] Detalles`, `[B] Solución`). Section headers
  carry red square chips with `01`/`02`/`03`/`04`.
- **Date / time:** `es-PR` locale, `DD/MM/YY HH:MM` 24h. AST timezone explicit
  in the topbar (`HORA AST`). Relative ago format for recent activity:
  `ahora`, `12m`, `3h`, `2d`.
- **IDs:** Internal ticket ID is `SM-00001` (SM = Servicio Mesa, padded 5).
  External cross-ref is `SF-XXXXX` (Salesforce). Customer ID is `EMAS` (6 digit).
  IDs always rendered in **mono with tabular figures**.
- **Emoji:** **None.** Substitutes are unicode glyphs (`✓`, `✕`, `›`, `+`, `/`)
  rendered in brand colors. The `/` glyph is used as a search affordance —
  Tropigas-red, immediately before the search input.
- **No marketing fluff.** No "Welcome", no "Let's get started", no exclamation
  marks. The closest thing to a feeling is the green pulse next to `OPERATIVO` /
  `CONECTADO`.
- **Examples (verbatim from product):**
  - Empty state: `SLA · Crítico / Vencido` → big check + `SIN INCIDENCIAS`
  - Toast (success): `✓ Ticket guardado · SM-00042`
  - Statusbar: `CONECTADO · Base: tropigas_pr_v3 · Registros: 14 · SLA día: 94%`
  - Form hint: `auto`, `Igual a física`, `787-XXX-XXXX`

---

## Visual Foundations

**Mood:** the brand site is bright/photo-led; the product is cool/dense. Tropigas
red is **the accent** — used sparingly but consistently for the things that need
to be seen first (primary CTA, alert states, vencido SLA, the 4px topbar
underline, "/" search prefix, focus ring on resolution textareas).

### Color
- **Primary chrome:** Navy (`--tg-navy #0F224A`). Always used for the topbar,
  statusbar, side-block titles, hero KPI panel, modal header, primary tab `.on`
  state. Body text on navy is white at 100% / 70%.
- **Accent:** Red (`--tg-red #E30512`). Reserved for primary action buttons
  (`NUEVO TICKET`, `GUARDAR REGISTRO`), the 4px bottom border on the topbar,
  the `::before '/'` glyph in search, the alert KPI tile (`Sin atender`),
  vencido SLA strip, status `Recibido`.
- **Neutrals:** A 9-step grayscale: `#FFFFFF → #F4F5F7 → #E5E7EB → #111827`.
  Body backgrounds use `--paper-2` (light gray); cards on top of that are pure
  white with hairline borders.
- **No gradients** anywhere except the inline PR flag (5-stripe horizontal
  gradient with a triangle border-trick). No bluish-purple. No glassmorphism.
- **Backgrounds are flat color.** The brand uses photography on the marketing
  site; the product does not.
- **Imagery vibe (marketing):** documentary-style operational photos —
  warm midtones, real workers, real equipment. Not stock. Use sparingly in the
  product (login screen, empty states, splash) — never decoratively.

### Type
- **UI:** Rubik (300–900). Weights 500/600/700 dominate; 800 only for
  `brand-title`. Sizes: 9, 10, 11, 12, 13, 14, 17, 24. **No 15, 16, 18, 20** —
  the scale skips deliberately to keep hierarchy crisp.
- **Display:** Playfair Display (🚩 substituted for the bespoke serif used in
  the wordmark on the marketing site — see Substitutions below).
- **Mono:** JetBrains Mono for IDs, timestamps, KPI numerals. `font-feature-
  settings: "tnum"; font-variant-numeric: tabular-nums;`.
- Letter-spacing is **aggressive on uppercase** (`0.10–0.15em`) and slightly
  **negative on h1** (`-0.01em`).

### Spacing
4-step grid: `4 / 8 / 12 / 16 / 20 / 24 / 32`. Form grid is 3-col with 20px gap;
panel internals are 16–20px. The topbar is exactly 64px tall. The infobar tabs
38px. The statusbar 22px. Density matters — this is a workstation app.

### Borders & Radii
- Hairline borders everywhere (`1px solid --line`). Never thicker except the
  4px Tropigas-red topbar underline and 4px solution/desc accent strips.
- Radii: **6px** is the default for cards, buttons, fields, panels.
  4px for tags/pills. 8px only for the modal. **No fully-rounded buttons.**

### Shadows
- `--shadow-1`: `0 1px 2px rgba(0,0,0,0.03)` — table cards
- `--shadow-2`: `0 1px 3px rgba(0,0,0,0.05)` — panels
- `--shadow-3`: `0 4px 6px rgba(0,0,0,0.05)` — hover lift on doc cards
- `--shadow-modal`: layered drop for modal
- **No inner shadows. No glows.**

### Hover / Press
- Hover on tab/row: background → `--paper-2`, text → `--ink`.
- Hover on red button: `--tg-red` → `--tg-red-dark`.
- Hover on doc card: `translateY(-2px)` + `--shadow-3`.
- **No press/active scale-down.** No bouncy springs.
- Active row state on tickets table: simple bg fill + sticky header.

### Animation
- **Restrained.** Two motions exist:
  1. `blink` — 1.6s opacity fade on the green "live" pulse dot.
  2. Toast — 0.3s `cubic-bezier(0.4, 0, 0.2, 1)` slide-up + fade.
- Transitions on hover: 80–200ms linear/all. No spring physics, no stagger,
  no parallax.

### Focus
- 3px outer ring in navy (`--focus-navy`) on neutral fields, red (`--focus-red`)
  on resolution/comment textareas. Border darkens to navy on focus.

### Cards & Panels
- Pure white fill, `1px solid --line`, `--radius` (6px), `--shadow-2`.
- **Two-zone layout:** `panel-head` is white with navy/uppercase title and a
  bottom hairline; `panel-body` has 16px padding (or `no-pad` for tables).

### Tags & Status
- Status tags: 1px outline + uppercase text + tiny dot (`::before` 6px circle).
  No fill. Color = current state color.
- Importance tags: filled pill, `--imp-{level}-bg` + `--imp-{level}-fg`.
  The dot is omitted.
- Tab counts: pill (`--paper-2` fg `--ink-3`); inverts on `.on` to red bg, white fg.

### Layout & Fixed Elements
- Page is a 4-row CSS grid: `topbar (64) / infobar (auto) / main (1fr) / statusbar (22)`.
- Modal lives in a fixed inset overlay with `rgba(17, 24, 39, 0.7)` backdrop +
  `backdrop-filter: blur(2px)`. **Only place blur is used.**
- Toast: fixed bottom-right, 38px above statusbar.
- No floating action buttons. No sticky bottom bars on mobile.

### Imagery Treatment
- Photos used **untouched** — no duotone, no overlay, no grain. The plant photos
  are warm-grade operational documentary shots; let them be photos.

### What we deliberately don't do
- No emoji. No hand-drawn SVG illustration. No textures or repeating patterns.
- No glassmorphism / backdrop-filter except modal backdrop.
- No bluish-purple gradient. No left-color-bar-with-rounded-corners cards.
- No icon system inside the product (see Iconography).

---

## Iconography

The product **does not use a real icon system**. Across 3,100+ lines of HTML,
not a single `<svg>` icon, no icon font, no `lucide` / `heroicons` / FontAwesome
import. Icons are built from:

- **Unicode glyphs** in brand colors: `+` (new ticket), `✕` (close), `✓`
  (toast/success/empty), `›` (breadcrumb), `/` (search prefix, in red), `←` (back).
- **Tiny accent shapes via CSS**: a 4×12 rounded rect `::before` next to KPI
  labels; 6×6 dot `::before` next to status text; the PR flag is built entirely
  from a 16×11 multi-stop linear-gradient + a triangle made from CSS borders.
- **Drawn-in-CSS doc tiles**: file-type chips that say `PDF` / `IMG` in a colored
  square — no document iconography.
- **Avatar initials**: 26×26 / 28×28 navy circle with white initials.

**For our design system we keep this stance — Unicode + CSS shapes — but extend
it with one optional set: Lucide via CDN**, when a richer icon language is
required (status pickers, sidebar nav, attachments). Lucide is chosen for its
1.5px stroke weight and rectangular geometry which matches the product's
hairline aesthetic. **🚩 Substitution:** the codebase has no icon library, so
Lucide is an additive choice — flag if Tropigas already has an internal icon
sheet you'd like used instead.

Logos live in `assets/`:
- `tropigas-logo.png` — primary white wordmark, transparent bg (use on navy/red)
- `tropigas-logo-on-navy.png` — preview/static composition for cards
- `tropigas-logo-on-red.png` — preview/static composition for cards

---

## Substitutions to confirm

- **🚩 Display serif.** The marketing wordmark uses a custom or bespoke serif
  with classical proportions (high contrast, serif terminals). I substituted
  **Playfair Display** from Google Fonts — closest free match in weight 800/900.
  Please confirm or send the original font file (`.otf` / `.ttf`).
- **🚩 Iconography.** No icon library exists in code; I propose **Lucide via
  CDN** as an additive option. Confirm or share an internal sheet.
- **🚩 No PR-Spanish copy review yet.** I'm matching the existing app verbatim,
  but a native-PR copy pass may want to tighten verbs / casing.

---

## Index of files

| File / folder | What it is |
|---|---|
| `README.md` | This document |
| `SKILL.md` | Cross-compatible Agent Skills entry point |
| `colors_and_type.css` | All CSS variables — color, type, spacing, radius, shadow |
| `assets/` | Logo, plant photos, brand-bg compositions |
| `preview/*.html` | Cards that populate the Design System tab |
| `ui_kits/helpdesk/` | UI kit with React components for the Mesa de Ayuda app |
