# Helpdesk · UI Kit

Recreations of the Tropigas IT Mesa de Ayuda screens.

- `index.html` — interactive click-thru of the three core surfaces
  (Dashboard → Tickets table → Ticket detail), plus the New Ticket modal.
- Components are inline React (Babel) for portability — they mirror the structure
  of the production app at `TropiGas/tickets-tropigas.html` but use the design
  tokens from `../../colors_and_type.css`.
- The fake data uses real-feeling Tropigas scenarios: fugas, reposiciones,
  generadores, EMAS numbers, Ponce/Mayagüez/Bayamón locations.
