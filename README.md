# Mahjong Hand Betting Game

A modern, interactive web-based betting game using Mahjong tiles with dynamic value scaling, real-time scoring, and a responsive Material Design-inspired UI built with React and Vite.

[![React](https://img.shields.io/badge/React-19-61dafb)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646cff)](https://vitejs.dev/)
[![Tailwind](https://img.shields.io/badge/Tailwind-3-38bdf8)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

---

## Overview

Play and compete by betting on consecutive hands while managing dynamic tile values and tracking performance through a leaderboard system.

---

## Game Rules

### Objective
Predict whether the next hand total will be **higher** or **lower** than the current hand.

### Scoring
- Correct prediction: earn hand value as points
- Incorrect prediction: earn zero points

### Game Over Conditions
- Any tile value reaches 0 or 10
- OR three deck reshuffles are completed

### Tile System

**Total Tiles:** 34 Unique Tiles

**Number Tiles (27)**
- Bamboo, Characters, and Dots (1-9)
- Fixed value equal to face value (unchanged throughout gameplay)

**Honor Tiles (7)**
- Dragons: Red, Green, White (initial value 5)
- Winds: East, West, North, South (initial value 5)
- Value changes dynamically:
  - Win: +1
  - Loss: -1

### Leaderboard
- Top 5 scores stored using localStorage
- Automatically updated after each game
- Final score formula: `Base Score + (Rounds × 2)`

---

## Quick Start

### Prerequisites
- Node.js 16 or higher
- npm

### Installation

```bash
git clone https://github.com/yourusername/mahjong-betting-game.git
cd mahjong-betting-game
npm install
Development
bash
npm run dev
Application runs at: http://localhost:5175

Production Build
bash
npm run build
Preview Build
bash
npm run preview
Architecture
State Management
Centralized using useGameState:

Screen navigation

Deck state

Scoring system

History management

Reshuffle logic

Leaderboard updates

Core Modules
tiles.js

Defines all 34 Mahjong tiles and their initial values

deck.js

Deck creation and shuffling

Tile drawing logic

Value updates

Reshuffle system

Game over detection

scoring.js

Hand comparison logic

Win/loss evaluation

Score calculation

Leaderboard persistence

UI Architecture
Components

Screen-based structure:

Landing Page

Game Screen

Game Over Screen

Leaderboard Screen

Reusable UI components:

TileCard

HandHistory

StatsGrid

Button

Input

Tech Stack
React 19

Vite

Tailwind CSS

Framer Motion

JavaScript (ES6+)

localStorage for persistence

Development Approach (AI Usage Transparency)
This project was developed with selective AI assistance to improve development speed and design quality while maintaining full control over architecture and implementation.

AI was used for:

1)UI/UX Design Support

2)Used Stitch AI for layout inspiration and UI structure ideas

3)Debugging and Code  syntax Assistance

4)Helped improve maintainability of game logic modules

Human Responsibility:

1)All core game rules and logic were designed and implemented independently

2)Final architectural decisions were made manually

3)All AI suggestions were reviewed, tested, and validated before integration

Project Structure:

src/
├── main.jsx
├── App.jsx
├── components/
│   ├── screens/
│   │   ├── LandingPage.jsx
│   │   ├── GameScreen.jsx
│   │   ├── GameOverScreen.jsx
│   │   └── LeaderboardScreen.jsx
│   ├── game/
│   │   ├── TileCard.jsx
│   │   ├── HandHistory.jsx
│   │   └── StatsGrid.jsx
│   ├── ui/
│   │   ├── Button.jsx
│   │   └── Input.jsx
│   └── hooks/
│       └── useGameState.js
├── lib/
│   ├── tiles.js
│   ├── deck.js
│   └── scoring.js
└── assets/
Testing & Validation
Verified 34 unique tile generation

Validated honor tile value scaling

Tested betting logic accuracy

Verified reshuffle mechanics

Confirmed leaderboard persistence

Validated game-over conditions

Ensured responsive UI behavior

Build verified with zero errors

Deployment
bash
npm install
npm run dev
Production build:

bash
npm run build
Author
Jumana Iqbal

