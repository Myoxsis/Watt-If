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

1. Add scenario mode with named crisis cards and comparison history
2. Add yearly turns from 2026 to 2040
3. Add budget and investment choices
4. Add final report card
5. Add real-world country presets
6. Add an LLM-powered scenario generator
