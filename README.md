# Watt-If?

An interactive energy crisis simulator built for a hackathon theme around energy.

You play the role of a Minister of Energy and stress-test a national grid against heatwaves, wind droughts, EV adoption, nuclear outages, and gas shocks.

## Phase 1 MVP

- Node + Vite + React + TypeScript app
- Energy production sliders
- Demand pressure sliders
- Climate event sliders
- Disaster scenario cards
- Live reliability, blackout risk, carbon, price, and approval metrics
- Stylized grid map
- Chief Energy Advisor explanations

## Phase 2 Simulation Engine

The simulator now models:

- Supply vs. average demand and peak demand
- Renewable intermittency from heatwaves, drought, and wind droughts
- Battery discharge during peak stress
- Reserve margin above or below peak load
- Unserved energy when demand exceeds supply
- Renewable share and storage coverage
- Scarcity-based electricity price
- Weighted carbon intensity
- Public approval and overall grid score
- Production breakdown by source

## Phase 3 Scenario Mode

Scenario mode adds:

- Rich crisis cards with category, severity, and narrative
- Before/after metric comparisons after each scenario
- Scenario impact panel with score, reliability, blackout risk, carbon, and price deltas
- Run history for the last six scenarios
- Best-score and highest-risk highlights
- Additional scenarios: Data Center Boom and Drought Summer

## Run locally

```bash
npm install
npm run dev
```

Then open the local URL printed by Vite.

## Build

```bash
npm run build
```

## Next roadmap items

1. Add yearly turns from 2026 to 2040
2. Add budget and investment choices
3. Add final report card
4. Add real-world country presets
5. Add an LLM-powered scenario generator
