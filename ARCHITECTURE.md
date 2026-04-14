# Mahjong Betting Game - Architecture Guide

A modern React betting game using Mahjong tile mechanics with Material Design 3 styling and Framer Motion animations.

---

## Table of Contents
1. [Project Structure](#project-structure)
2. [Technology Stack](#technology-stack)
3. [Game Mechanics](#game-mechanics)
4. [State Management](#state-management)
5. [Component Architecture](#component-architecture)
6. [Data Flow](#data-flow)
7. [Adding Features](#adding-features)
8. [Key Design Decisions](#key-design-decisions)

---

## Project Structure

```
src/
├── main.jsx                 # App entry point (renders App.jsx)
├── App.jsx                  # Root component, routing logic
├── App.css                  # Root styles
├── index.css                # Global styles, fonts, Tailwind directives
│
├── components/
│   ├── ui/
│   │   ├── Button.jsx       # Reusable button component with Material 3 styling
│   │   ├── TileCard.jsx     # Individual tile display with flip animation
│   │   └── HandHistory.jsx  # Scrollable list of all past hands
│   │
│   ├── game/
│   │   ├── BetButtons.jsx   # Higher/Lower bet buttons
│   │   ├── DeckPile.jsx     # Draw pile display with remaining count
│   │   └── DiscardPile.jsx  # Discard count display
│   │
│   └── screens/
│       ├── LandingScreen.jsx    # Entry screen with name input + leaderboard
│       ├── GameScreen.jsx       # Main gameplay (board, tiles, history, stats)
│       └── GameOverScreen.jsx   # Final score, stats, save/exit buttons
│
├── hooks/
│   └── useGameState.js      # Central state management hook
│
└── lib/
    ├── tiles.js             # 34 unique Mahjong tiles definition & deck creation
    ├── deck.js              # Deck operations (draw, discard, reshuffle, value updates)
    └── scoring.js           # Scoring logic & leaderboard (localStorage)
```

### File Responsibilities

| File | Responsibility | Dependencies |
|------|-----------------|---|
| **App.jsx** | Route screens based on game state | useGameState, all screens |
| **LandingScreen** | Name input & leaderboard display | scoring.js, Button |
| **GameScreen** | Main gameplay interface | useGameState, TileCard, HandHistory, BetButtons |
| **GameOverScreen** | Final score display & save | useGameState, Button |
| **useGameState** | Game state & logic orchestration | deck.js, scoring.js, tiles.js |
| **tiles.js** | Tile constants & deck creation | none (utility) |
| **deck.js** | Tile operations & value dynamics | tiles.js |
| **scoring.js** | Points & leaderboard management | localStorage API |

---

## Technology Stack

### Frontend Framework
- **React 19.2.4** - UI library with hooks
- **Vite 8.0.4** - Build tool with HMR at `localhost:5175`

### Styling & Animations
- **Tailwind CSS 3.4.19** - Utility-first CSS with custom Material 3 theme
- **Framer Motion 12.38.0** - Animation library for smooth transitions
- **Material Symbols Outlined** - Icon font for tile and UI icons

### Fonts
- **Space Grotesk** - Headlines (bold, geometric)
- **Inter** - Body text (readable, professional)

### Color System (Material 3)
```js
// Core colors (in tailwind.config.js)
background: #111316
surface: #1c1f23
primary: #59de9b (bright green)
secondary: #e9c349 (golden yellow)
tertiary: #ffb4ac (coral pink)
on-surface: #fffbfe (light text)
outline-variant: #49454e (muted lines)
```

---

## Game Mechanics

### Tile System

**34 Unique Tiles (1 copy each):**

#### Number Tiles (27 tiles)
- **Bamboo 1-9** (7值 fixed)
- **Characters 1-9** (值 fixed)  
- **Dots 1-9** (值 fixed)
- **Value**: Always equals face value (1-9), never changes

#### Honor Tiles (7 tiles - values DYNAMIC)
- **Dragons**: Red, Green, White (start value: 5)
- **Winds**: East, West, North, South (start value: 5)
- **Dynamic Rule**: ±1 based on win/loss

### Game Flow

```
1. SETUP
   - Player enters name
   - Draw deck created: 34 unique tiles shuffled
   - Discard pile: empty

2. EACH HAND (LOOP)
   - Current hand value calculated
   - Player sees: Hand total vs. Target (0 initially)
   - Player bets: HIGHER or LOWER
   - Draw 3 new tiles
   - New hand value calculated
   - Determine winner: WON / LOST / TIE
   - Update tile values (if dragons/winds involved)
   - Check reshuffle condition
   - Add to history
   - Check game-over conditions

3. GAME OVER CONDITIONS (any triggers end)
   a) Tile counter ≤ 0 or ≥ 10
   b) 3rd reshuffle completed
   
4. END
   - Calculate final score: points + streak_bonus + rounds_bonus
   - Display game over screen
   - Save to leaderboard (optional)
```

### Tile Value Dynamics

```js
// Number tiles: FIXED value
Bamboo 5 = value: 5 (always)
Characters 7 = value: 7 (always)

// Honor tiles: START at 5, change based on outcomes
Dragon Red = value: 5 initially
  - Hand WON with Dragon Red included → value becomes 6
  - Hand LOST with Dragon Red included → value becomes 4
  - Hand TIED → no change

// Bounds Enforcement
- Minimum value: 0 (if tile would be -1, set to 0 → game over)
- Maximum value: 10 (if tile would be 11, set to 10 → game over)
```

### Reshuffle Mechanics

```
When draw pile reaches exactly 0 tiles:
  1. Move all discard pile cards back to draw pile
  2. Increment reshuffle counter (0/3 → 1/3 → 2/3 → 3/3)
  3. If reshuffle_count = 3: triggers GAME OVER
  4. Otherwise: continue playing
```

### Streak System

```
Won hand → streak +1
Lost hand → streak reset to 0
Tied hand → no change to streak

Used in: Final score calculation (streak × 10 bonus points)
```

---

## State Management

### useGameState Hook

Central state management hook in `src/hooks/useGameState.js` that manages the entire game life cycle.

```js
// State structure
{
  screen: 'landing' | 'game' | 'gameover',
  
  // Deck
  drawPile: [tile1, tile2, ...],        // Remaining tiles to draw
  discardPile: [tile1, tile2, ...],     // Discarded tiles
  currentHand: [tile1, tile2, tile3],   // Player's 3 tiles
  
  // Game progress
  score: 0,
  roundsPlayed: 0,
  reshuffleCount: 0,
  streak: 0,
  
  // History
  history: [
    { tiles: [tile1, tile2, tile3], value: 15, result: 'win' },
    ...
  ],
  lastResult: 'win' | 'loss' | 'tie' | null,
  
  // Leaderboard
  leaderboard: [
    { playerName: 'Alice', score: 350, date: '4/14/2026' },
    ...
  ],
  playerName: 'TestPlayer'
}
```

### Key Functions

```js
// Initialize game
startGame(playerName)
  - Create 34-tile deck
  - Reset score, rounds, streak
  - Draw first hand
  - Transition to 'game' screen

// Main game action
placeBet(bet: 'higher' | 'lower')
  - Draw 3 tiles
  - Calculate totals
  - Compare results
  - Update tile values
  - Check reshuffle
  - Add to history
  - Check game over

// Game end
endGame()
  - Calculate final score
  - Transition to 'gameover' screen

// Leaderboard management
saveScore()
  - Call scoring.saveToLeaderboard()
  - Refresh leaderboard state
  - Return to landing screen

// Helpers
reshuffle()
  - Move discard → draw pile
  - Increment counter
  - Return to game if counter < 3

resetGame()
  - Clear all state
  - Return to landing screen
```

---

## Component Architecture

### Screen Components (Top Level)

#### LandingScreen
```
Purpose: Entry point & leaderboard display
Props: None (uses useGameState hook directly)
State: Local textbox for player name
Flow:
  1. User enters name in textbox
  2. Clicks "New Game" button
  3. Calls state.startGame(playerName)
  4. App routes to GameScreen
```

#### GameScreen
```
Purpose: Main gameplay interface
Props: None
Layout:
  ┌─ Top Bar (Stats) ─────┐
  │ Draw: 31/34  │  Discard: 3  │  Reshuffles: 0/3
  │
  ├─ Hand Display ────────┤
  │ [Tile1] [Tile2] [Tile3]
  │ Hand Total: 15 | Target: 0
  │
  ├─ Action Buttons ──────┤
  │ [Bet Higher]  [Bet Lower]
  │
  └─ History (Scrollable) ┘
    #1: [icons] Value: 15 ✓ Win
    #2: [icons] Value: 13 ✗ Loss
```

#### GameOverScreen
```
Purpose: Final results & save score
Props: None
Display:
  - Final Score (animated counter)
  - Rounds Played
  - Best Streak
  - Reshuffles Used
  - [Save Score] [Exit Game] buttons
```

### UI Components (Reusable)

#### TileCard
```
Props:
  - tile: { name: 'Dragon Red', type: 'dragon', value: 5 }
  - showFlip: boolean (animation trigger)
  
Displays:
  - Tile icon from Material Symbols
  - Tile value
  - Flip animation on draw
```

#### HandHistory
```
Props:
  - history: [{ tiles, value, result }, ...]
  
Displays (scrollable):
  - Hand number (#1, #2, #3...)
  - All 3 tiles as icons
  - Total value
  - Status: ✓ Win (green) / ✗ Loss (red) / ○ Tie (yellow)
```

#### BetButtons
```
Props:
  - onBetHigher: () => void
  - onBetLower: () => void
  - disabled: boolean
  
Displays:
  - [expand_less Bet Higher] button
  - [expand_more Bet Lower] button
```

---

## Data Flow

### Information Flow Diagram

```
┌─────────────────────────────────────────────────────┐
│                   App.jsx (Router)                   │
│        Selects screen based on state.screen         │
└─────────────────┬───────────────────────────────────┘
                  │
       ┌──────────┴──────────┐
       │                     │
       v                     v
  LandingScreen         GameScreen
       │                     │
       └──────┬──────────────┘
              │
        useGameState()
        (Central Hub)
              │
       ┌──────┴──────┬──────────┐
       │             │          │
       v             v          v
    tiles.js    deck.js     scoring.js
   (Constants) (Operations) (Logic)
       │
   localStorage
  (Leaderboard)
```

### Example: Placing a Bet

```
User clicks "Bet Higher"
  ↓
GameScreen.jsx → state.placeBet('higher')
  ↓
useGameState.js → placeBet() function
  ├─ deck.drawTiles(drawPile)
  │  └─ Returns 3 new tiles
  ├─ scoring.calculateHandTotal(tiles)
  │  └─ Sum current hand vs new hand
  ├─ scoring.checkBetResult(bet, current, new)
  │  └─ Compare totals, determine winner
  ├─ deck.updateTileValues(tiles, hand, playerWon)
  │  └─ ±1 for dragons/winds only
  ├─ deck.checkTileGameOver(allTiles)
  │  └─ Check if any tile ≤0 or ≥10
  ├─ Add to history
  └─ Check reshuffle condition
  ↓
state.history updated
state.score updated
state.currentHand updated
  ↓
React re-renders GameScreen
  ↓
UI shows new hand, history entry, and updated stats
```

---

## Adding Features

### Example 1: Add a "Bet Exactly" Option

**Step 1: Update tiles.js constants**
```js
// Add to game constants section (if not exists)
export const BET_TYPES = {
  HIGHER: 'higher',
  LOWER: 'lower',
  EXACTLY: 'exactly'
}
```

**Step 2: Update scoring.js**
```js
export const checkBetResult = (bet, currentTotal, newTotal) => {
  if (bet === 'higher') return newTotal > currentTotal
  if (bet === 'lower')  return newTotal < currentTotal
  if (bet === 'exactly') return newTotal === currentTotal  // ADD THIS
  return false
}
```

**Step 3: Update useGameState hook**
```js
// In placeBet() function, pass bet type through
const playerWon = checkBetResult(bet, currentTotal, newTotal)
```

**Step 4: Update GameScreen UI**
```jsx
// In BetButtons or directly in GameScreen
<button onClick={() => state.placeBet('exactly')}>
  Bet Exactly
</button>
```

### Example 2: Add a Multiplier Bet System

**Step 1: Update scoring.js**
```js
export const calculatePoints = (playerWon, newHand, multiplier = 1) => {
  if (!playerWon) return 0
  const handTotal = calculateHandTotal(newHand)
  return handTotal * multiplier  // Apply multiplier
}
```

**Step 2: Update useGameState**
```js
// In placeBet(), add multiplier parameter
const points = calculatePoints(playerWon, newHand, currentMultiplier)
// Or allow user-selected multiplier before bet
```

**Step 3: Update GameScreen UI**
```jsx
// Add multiplier selector before bet buttons
<select value={multiplier} onChange={(e) => setMultiplier(e.target.value)}>
  <option value={1}>1x</option>
  <option value={2}>2x</option>
  <option value={3}>3x</option>
</select>
```

### Example 3: Add a New Game Mode (Survival Mode)

**Step 1: Create new mode constants**
```js
// Add to tiles.js or new constants.js
export const GAME_MODES = {
  CLASSIC: 'classic',
  SURVIVAL: 'survival'
}

// Survival mode: 1 life, any tile reaching 0 ends game
```

**Step 2: Update useGameState**
```js
const startGame = (playerName, mode = 'classic') => {
  setState(prev => ({
    ...prev,
    gameMode: mode,
    lives: mode === 'survival' ? 1 : null
  }))
}

// In placeBet(), check mode-specific game over conditions
if (state.gameMode === 'survival' && anyTileZero) {
  endGame() // Immediate loss if any tile hits 0
}
```

**Step 3: Update LandingScreen**
```jsx
// Add mode selector
<select value={gameMode} onChange={(e) => setGameMode(e.target.value)}>
  <option value="classic">Classic</option>
  <option value="survival">Survival</option>
</select>

// Pass to startGame
onClick={() => state.startGame(playerName, gameMode)}
```

---

## Key Design Decisions

### 1. **Centralized State Management**
Why: Single source of truth in `useGameState` makes debugging easier and prevents data inconsistencies.
Benefit: All components stay in sync; adding features only requires state updates.

### 2. **Functional Separation in lib/**
Why: Keep game logic separate from React components.
Benefit: Logic can be tested independently, reused in Node backend, or ported to other frameworks.

### 3. **Immutable State Updates**
Why: React requires state to be immutable to detect changes.
Benefit: Clear data flow; time-travel debugging possible; prevents accidental mutations.

### 4. **Tailwind CSS with Custom Theme**
Why: Material 3 theme brings professional, modern appearance without custom CSS.
Benefit: Easy to modify colors; consistent across all components; responsive by default.

### 5. **Framer Motion for Animations**
Why: Smooth animations enhance user experience.
Benefit: Declarative animations; automatic staggering; performance optimized.

### 6. **Leaderboard in localStorage**
Why: Persistent storage without backend; simple to implement.
Limitation: Data lost when browser cache cleared; not synced across devices.
Future: Replace with database (Firebase, Supabase) for multi-device sync.

---

## Common Tasks & Solutions

### Q: How do I change the number of tiles in a hand?
**A:**
1. Update `tiles.js`: `export const HAND_SIZE = 3` → `4` (or desired number)
2. Update draws in `deck.js`: `drawTiles(drawPile, 3)` → `drawTiles(drawPile, 4)`
3. Update UI in `GameScreen.jsx`: Tile grid from 3 columns to N columns

### Q: How do I change game-over condition?
**A:** Edit `deck.js → checkTileGameOver()`:
```js
// Change from: any tile ≤0 or ≥10
// To: score ≥ 500, or roundsPlayed ≥ 100
export const checkTileGameOver = (roundsPlayed, score) => {
  return score >= 500 || roundsPlayed >= 100
}
```
Then update call in `useGameState.placeBet()`.

### Q: How do I add a new tile type?
**A:**
1. Add to `tiles.js` → `createSpecialTiles()` function
2. Add starting value and dynamic rule
3. Include in `createDeck()` return array
4. Add icon/display in `TileCard.jsx`

### Q: How do I change scoring formula?
**A:** Edit `scoring.js → calculateFinalScore()`:
```js
// Current: score + (streak × 10) + (rounds × 2)
// Custom: score × multiplier, add bonuses, etc.
export const calculateFinalScore = (score, roundsPlayed, streak) => {
  return score * 1.5 + (streak * 20) + (roundsPlayed * 5)
}
```

### Q: How do I store data in a database instead of localStorage?
**A:**
1. Install database SDK (Firebase, Supabase, etc.)
2. Replace `localStorage` calls in `scoring.js`:
   ```js
   // Old: localStorage.setItem('mahjong-leaderboard', JSON.stringify(leaderboard))
   // New: await database.collection('leaderboards').add({ playerName, score, date })
   ```
3. Update `getLeaderboard()` to fetch from database
4. Handle async/await properly in components

---

## Performance Tips

1. **Use React DevTools Profiler** to identify slow renders
2. **Memoize expensive calculations**:
   ```js
   const memoizedTotal = useMemo(() => calculateHandTotal(hand), [hand])
   ```
3. **Use `useCallback` for event handlers** passed to child components
4. **Code-split screens** using React.lazy() for faster initial load
5. **Optimize animations** - Framer Motion is already performant, but avoid animating large lists

---

## Testing Strategy

### Unit Tests (jest + @testing-library/react)

```js
// Test deck operations
test('createDeck returns 34 unique tiles', () => {
  const deck = createDeck()
  expect(deck).toHaveLength(34)
})

// Test scoring
test('calculateHandTotal sums all tile values', () => {
  const hand = [{ value: 5 }, { value: 6 }, { value: 7 }]
  expect(calculateHandTotal(hand)).toBe(18)
})

// Test bet results
test('bet higher wins when newTotal > currentTotal', () => {
  expect(checkBetResult('higher', 10, 15)).toBe(true)
})
```

### Integration Tests

```js
// Test full game flow
test('game over at 3rd reshuffle', () => {
  // Play until reshuffle_count === 3
  // Verify endGame() called
})
```

### Manual Testing Checklist

- [ ] Start new game with name
- [ ] Play 5 hands
- [ ] Verify history shows correct tiles/values/status
- [ ] Trigger reshuffle (4th hand when 0 tiles remaining)
- [ ] Verify reshuffle counter updates
- [ ] Trigger game over (3rd reshuffle or tile ≤0)
- [ ] Save score to leaderboard
- [ ] Verify name appears on leaderboard
- [ ] Play again with different name
- [ ] Verify multiple scores on leaderboard

---

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| Name not showing on leaderboard | Wrong key (`entry.name` vs `entry.playerName`) | Check [LandingScreen.jsx](src/components/screens/LandingScreen.jsx#L134) line 134 |
| Tile values not updating | Update logic in wrong order | Ensure `updateTileValues()` called AFTER bet result calculated |
| Game-over condition not triggering | Logic not reached | Add `console.log()` in `checkTileGameOver()` to debug |
| Animation stuttering | Too many simultaneous animations | Reduce animation duration or use `reduceMotion` media query |
| Build error: "tile is undefined" | `tiles.js` not imported | Check imports in files using tiles |

---

## Next Steps & Future Enhancements

1. **Backend Integration**
   - Replace localStorage with Firebase/Supabase
   - Enable cross-device leaderboard sync
   - Add user authentication

2. **Advanced Features**
   - Multiple game modes (Survival, Endless, Time Attack)
   - Power-ups (double points, skip reshuffle, etc.)
   - Multiplayer (real-time betting)
   - Statistics/analytics dashboard

3. **UI/UX Improvements**
   - Sound effects & music
   - Mobile app (React Native)
   - Dark/light theme toggle
   - Accessibility improvements (WCAG AA)

4. **Performance**
   - Code-split components
   - Service Workers for offline play
   - Optimize animations for 60fps

---

## Resources

- [React Docs](https://react.dev)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [Framer Motion Docs](https://www.framer.com/motion)
- [Vite Docs](https://vitejs.dev)
- [Material Design 3](https://m3.material.io)

---

**Last Updated**: April 14, 2026  
**Version**: 1.0.0  
**Maintainer**: Development Team
