# Watt-If Game UI/UX Roadmap

The current app has the core simulator and now a first pass at a strategy-game command-center skin. The next improvements should make it feel less like a dashboard and more like a playable energy crisis management game.

## 1. Windowed Command OS

Turn every major panel into a draggable/resizable in-game window:

- Grid Map window
- Minister Actions window
- Crisis Feed window
- Advisor Terminal window
- Country Benchmarks window
- Budget & Timeline window

Recommended library options:

- `react-rnd` for draggable/resizable panels
- `framer-motion` for animated open/close/minimize transitions
- CSS-only fallback for hackathon stability

UX goal: make the app feel like an operating system for managing a national grid.

## 2. Action Cards Instead of Sliders

Sliders still feel like a simulator. Replace most sliders with strategic cards:

- Build offshore wind
- Extend nuclear lifetime
- Subsidize heat pumps
- Create EV charging curfew
- Deploy demand response
- Import emergency gas
- Invest in transmission

Each card should show:

- Cost
- Time to build
- Political risk
- Reliability impact
- Carbon impact

UX goal: players make decisions, not tweak variables.

## 3. Turn-Based Crisis Loop

Each year should have a clear loop:

1. Morning Briefing
2. Choose Investments
3. Crisis Event
4. Advisor Report
5. Public Reaction
6. End-Year Score

Add a big "End Turn" flow with animations instead of instantly changing numbers.

UX goal: make time progression dramatic and understandable.

## 4. City-Level Consequences

The map should show local outcomes:

- Paris blackout
- Lyon price protests
- Marseille heatwave emergency
- Industrial zone power rationing
- Rural wind opposition

Each city can have stats:

- Happiness
- Demand
- Outage risk
- Political pressure

UX goal: turn abstract metrics into visible consequences.

## 5. Advisor Characters

Replace the single advisor panel with character advisors:

- Grid Operator: cares about reliability
- Climate Scientist: cares about carbon
- Finance Minister: cares about price and budget
- Citizens' Union: cares about approval
- Industry Lobby: cares about cheap power

They can disagree after each move.

UX goal: make tradeoffs emotional and memorable.

## 6. Better Report Card and Win Conditions

At 2040, generate a final cinematic report:

- Energy grade
- Timeline of crises survived
- Biggest mistake
- Best investment
- Closest real-world country
- Judge-friendly export image

Win condition examples:

- Reliability above 92%
- Carbon below 100 gCO2/kWh
- Price below 0.25 EUR/kWh
- Approval above 60%

UX goal: give players a satisfying ending.

## 7. Real Dataset Upgrade

Current presets are source-inspired. Next, add a real dataset file:

- `data/countries.json`
- electricity mix percentages
- carbon intensity
- demand profile
- import dependency
- source notes and links

Suggested sources:

- Ember Electricity Data Explorer
- IEA country electricity profiles
- ENTSO-E transparency platform
- Electricity Maps carbon intensity data

UX goal: judges trust the simulation because it has traceable assumptions.

## 8. Sound and Feedback

Add optional UI sound effects:

- Crisis alert
- Investment confirmed
- Blackout warning
- Year advanced
- Victory/failure

Also add visual feedback:

- screen shake on blackout
- pulse on score increase
- sparks on overloaded power lines
- glowing city recovery after investment

UX goal: make actions feel responsive.

## 9. Difficulty Modes

Add modes:

- Tutorial
- Normal
- Energy Crisis
- Net Zero 2040
- No Nuclear Challenge
- 100% Renewables Challenge

UX goal: replayability and better demo control.

## 10. Priority Build Order

Recommended next sprint:

1. Create real window components with minimize/focus states
2. Replace manual sliders with action cards for primary gameplay
3. Add end-turn modal sequence
4. Add city consequences on the map
5. Add final 2040 cinematic report

The biggest leap will come from replacing sliders with decision cards and turning the app into a windowed command OS.
