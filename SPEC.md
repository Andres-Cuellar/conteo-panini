# Panini World Cup 2026 - Sticker Album Tracker

## Concept & Vision

A personal collection tracker for the FIFA World Cup 2026 Panini album. The app feels like a **collector's digital companion** — structured, tactile, satisfying. Think of a premium sports trading card app meets a minimalist sports database. The experience should evoke the excitement of completing a collection: clear progress visualization, easy sharing of "wanted stickers" via QR, and seamless local persistence.

## Design Language

**Aesthetic**: Modern sports editorial — clean data visualization with bold typographic moments. Dark theme with vibrant accent colors inspired by Panini's brand.

**Color Palette**:
- Background: `#0f1117` (near black)
- Surface: `#1a1d26` (card background)
- Border: `#2a2f3d`
- Text Primary: `#f5f5f7`
- Text Secondary: `#8b8f9a`
- Accent Primary: `#e63946` (Panini red)
- Accent Secondary: `#457b9d` (teal accent)
- Success: `#2a9d8f`
- Warning: `#e9c46a`

**Typography**:
- Display: `Syne` (bold, geometric, modern sports feel)
- Body: `DM Sans` (clean, readable)
- Mono: `JetBrains Mono` (for numbers/stats)

**Spatial System**: 4pt base grid. Generous padding in cards (24px), tight grid for team selectors.

**Motion Philosophy**:
- Entrance: fade + subtle translateY, 300ms ease-out-quint
- Progress bars: smooth width transitions 600ms ease-out-quint
- Interactions: 150ms transitions on hover states
- Staggered list reveals on mount

## Layout & Structure

### Main Dashboard (`/`)
1. **Header**: App title + session selector (top right)
2. **Hero Stats Panel**:
   - Total completion percentage (massive display number)
   - Circular progress ring visualization
   - Stats row: total stickers / total needed / missing
3. **Teams Grid**: 8 groups displayed as expandable sections, each team shows mini progress bar
4. **Action Bar**: Fixed bottom bar with Export, Import, Share QR buttons

### Team Detail (`/team/[code]`)
1. **Back navigation**
2. **Team header**: Flag placeholder, team name, group, completion %
3. **Sticker Grid**: 20 stickers in 5x4 grid, tap to mark owned/missing
4. **Quick actions**: Mark all owned, Mark all missing

### QR Share Modal
- Displays QR code encoding missing stickers in URL format
- URL format: `?session=X&col=1-2-3,arg=5-6-7...`
- Copy URL button

### Session Management
- Named sessions stored in localStorage
- Create/rename/delete sessions
- Active session persisted in URL hash

## Features & Interactions

### Core Features
1. **Sticker Tracking**: Each team has 20 stickers (numbered 1-20). Tap to toggle owned/missing.
2. **Completion Stats**: Real-time calculation of overall and per-team completion.
3. **Multi-Session**: Create unlimited named sessions. Switch via dropdown.
4. **Export/Import**: Download collection as JSON, import from JSON file.
5. **QR Sharing**: Generate QR containing missing stickers data for sharing.

### Interaction Details
- **Sticker tap**: Instant toggle with subtle scale animation (0.95 → 1.0)
- **Sticker owned state**: Filled background, checkmark overlay
- **Sticker missing state**: Hollow, slight border
- **Team card hover**: Subtle lift (translateY -2px), border glow
- **Progress bar fill**: Animated width transition on change

### Data Model
```typescript
interface Session {
  id: string;
  name: string;
  createdAt: number;
  stickers: Record<string, boolean[]>; // teamCode -> [owned, owned, ...] 20 booleans
}

interface AppState {
  sessions: Session[];
  activeSessionId: string;
}
```

### URL Sharing Format
```
?share=1&col=1-2-5-12&arg=3-7-15&bra=1-4-8-20
```
- `share=1` indicates this is a shared collection
- Teams with missing stickers listed as `code=missingIndices`

## Component Inventory

### ProgressRing
- SVG circle with stroke-dasharray animation
- Center displays percentage
- States: 0%, 1-99%, 100% (celebratory color)

### TeamCard
- Team abbreviation + name
- Mini 20-segment progress bar
- Completion text
- States: default, hover, expanded

### StickerButton
- Numbered button (1-20)
- States: missing (hollow), owned (filled with check), hover
- Size: 48x48px minimum touch target

### SessionSelector
- Dropdown showing all sessions
- Active session highlighted
- "New session" option at bottom

### ActionButton
- Fixed bottom bar buttons
- Icon + label
- States: default, hover, active, loading

### QRModal
- QR code image (generated via library)
- Shareable URL display
- Copy button with confirmation

## Teams Data

32 teams, 20 stickers each = 640 total stickers

```
Group A: QAT, ECU, SEN, NED
Group B: ENG, IRN, USA, WAL
Group C: ARG, KSA, MEX, POL
Group D: FRA, AUS, DEN, TUN
Group E: ESP, CRC, GER, JPN
Group F: BEL, CAN, MAR, CRO
Group G: BRA, SRB, SUI, CMR
Group H: POR, GHA, URU, KOR
```

## Technical Approach

- **Framework**: Next.js 14+ with App Router
- **Styling**: CSS Modules with CSS custom properties
- **State**: React Context + localStorage persistence
- **QR Generation**: `qrcode` library
- **Data Export**: File API for JSON download/upload
- **No backend**: All data stored locally in browser

## File Structure

```
/app
  layout.tsx          # Root layout with providers
  page.tsx            # Main dashboard
  /team/[code]
    page.tsx         # Team detail view
/components
  ProgressRing.tsx
  TeamCard.tsx
  StickerButton.tsx
  SessionSelector.tsx
  ActionBar.tsx
  QRModal.tsx
/lib
  teams.ts           # Team data constants
  storage.ts         # localStorage utilities
  qr.ts              # QR encoding/decoding
/context
  AppContext.tsx     # Global state provider
/styles
  globals.css        # CSS variables, base styles
```