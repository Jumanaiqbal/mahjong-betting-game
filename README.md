# Mahjong Hand Betting Game

Web-based Mahjong betting game built with React + Vite for the technical assessment.

## Tech Stack

- React 19
- Vite
- Tailwind CSS
- Framer Motion
- localStorage (leaderboard persistence)

## Setup

```bash
npm install
npm run dev
```

App runs at the Vite local URL shown in terminal (usually `http://localhost:5173`).

### Build

```bash
npm run build
npm run preview
```

## Implemented Assessment Requirements

### Landing Page

- New game entry with player name input.
- Top 5 leaderboard displayed from localStorage.

### Game Mechanics

- Uses Mahjong tile categories: number tiles, dragons, winds.
- Number tiles use fixed face values.
- Dragons/winds start at 5 and scale after each round:
  - Win: +1
  - Loss: -1
- Draw pile and discard pile counts are visible during gameplay.
- Reshuffle behavior:
  - Triggered when draw pile is empty.
  - A fresh full deck is added, combined with discard pile, then shuffled.
- Deck count note:
  - A single Mahjong deck is 34 unique tiles in this project.
  - Because each reshuffle adds a fresh deck before shuffling, draw pile counts can exceed 34 (for example, 67 = 33 discard + 34 fresh deck).
  - This is intentional and follows the assessment requirement text.
- Game over triggers when:
  - Any tracked tile value reaches 0 or 10, or
  - Draw pile reshuffles for the 3rd time.

### Gameplay Interface

- Exit button returns to landing page.
- Betting actions: Bet Higher / Bet Lower.
- Current hand tile visuals + hand total.
- History view of previous hands in compact form.
- End screen shows final score and summary stats.

## Architecture Notes (Extension-Ready)

- `src/hooks/useGameState.js`: central game state and flow orchestration.
- `src/lib/tiles.js`: tile definitions and deck creation.
- `src/lib/deck.js`: draw/discard/reshuffle mechanics.
- `src/lib/scoring.js`: hand totals, bet resolution, scoring, leaderboard.
- Screen components are separated by flow state (`landing`, `playing`, `gameover`).

This separation is designed so new rules/features can be added without rewriting UI flow.

## AI Usage Disclosure

### Handwritten / Owned by Developer

- Game rules implementation and state transitions.
- App structure, component decomposition, and integration.
- Final validation and requirement alignment decisions.

### AI-Assisted

- Iterative UI polishing ideas (layout/motion tweaks).
- Refactoring suggestions for readability.
- Debugging assistance for edge-case checks.

All AI-assisted changes were reviewed and manually validated before acceptance.
