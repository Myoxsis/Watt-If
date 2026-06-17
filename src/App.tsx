import { useMemo, useState } from 'react';
import { Activity, BatteryCharging, Factory, Flame, Gauge, RotateCcw, Zap } from 'lucide-react';
import { scenarios } from './data/scenarios';
import { buildAdvisorMessage, initialState, simulate, type EnergyState } from './lib/simulator';

const productionControls: Array<{ key: keyof EnergyState; label: string; icon: string }> = [
  { key: 'nuclear', label: 'Nuclear', icon: '⚛️' },
  { key: 'solar', label: 'Solar', icon: '☀️' },
  { key: 'wind', label: 'Wind', icon: '💨' },
  { key: 'hydro', label: 'Hydro', icon: '💧' },
  { key: 'gas', label: 'Gas', icon: '🔥' },
  { key: 'batteries', label: 'Batteries', icon: '🔋' },
];

const demandControls: Array<{ key: keyof EnergyState; label: string; icon: string }> = [
  { key: 'evAdoption', label: 'EV adoption', icon: '🚗' },
  { key: 'airConditioning', label: 'Air conditioning', icon: '❄️' },
  { key: 'industry', label: 'Industry', icon: '🏭' },
];

const eventControls: Array<{ key: keyof EnergyState; label: string; icon: string }> = [
  { key: 'heatwave', label: 'Heatwave', icon: '🌡️' },
  { key: 'drought', label: 'Drought', icon: '🏜️' },
  { key: 'windDrought', label: 'Wind drought', icon: '🌀' },
];

function SliderGroup({
  title,
  controls,
  state,
  onChange,
}: {
  title: string;
  controls: Array<{ key: keyof EnergyState; label: string; icon: string }>;
  state: EnergyState;
  onChange: (key: keyof EnergyState, value: number) => void;
}) {
  return (
    <section className="panel">
      <h2>{title}</h2>
      <div className="sliders">
        {controls.map((control) => (
          <label className="slider-row" key={control.key}>
            <span className="slider-label">
              <span>{control.icon}</span>
              {control.label}
            </span>
            <strong>{state[control.key]}</strong>
            <input
              type="range"
              min="0"
              max="100"
              value={state[control.key]}
              onChange={(event) => onChange(control.key, Number(event.target.value))}
            />
          </label>
        ))}
      </div>
    </section>
  );
}

function MetricCard({ label, value, detail, tone }: { label: string; value: string; detail: string; tone?: string }) {
  return (
    <article className={`metric ${tone ?? ''}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </article>
  );
}

function GridMap({ status, reliability }: { status: string; reliability: number }) {
  const cityClass = status === 'Stable' ? 'city stable' : status === 'Stressed' ? 'city stressed' : 'city danger';

  return (
    <section className="map-card">
      <div className="map-header">
        <div>
          <p className="eyebrow">Live grid map</p>
          <h2>France energy system</h2>
        </div>
        <span className={`status-pill ${status === 'Stable' ? 'good' : status === 'Stressed' ? 'warn' : 'bad'}`}>{status}</span>
      </div>

      <div className="grid-map" aria-label="Stylized country grid map">
        <div className="plant nuclear">⚛️</div>
        <div className="plant solar">☀️</div>
        <div className="plant wind">💨</div>
        <div className="plant hydro">💧</div>
        <div className="line l1" />
        <div className="line l2" />
        <div className="line l3" />
        <div className="line l4" />
        <div className={`${cityClass} paris`}>Paris</div>
        <div className={`${cityClass} lyon`}>Lyon</div>
        <div className={`${cityClass} marseille`}>Marseille</div>
        <div className="map-score">
          <Gauge size={18} />
          {reliability}% reliability
        </div>
      </div>
    </section>
  );
}

export default function App() {
  const [state, setState] = useState<EnergyState>(initialState);
  const metrics = useMemo(() => simulate(state), [state]);
  const advisorMessage = useMemo(() => buildAdvisorMessage(state, metrics), [state, metrics]);

  const updateState = (key: keyof EnergyState, value: number) => {
    setState((current) => ({ ...current, [key]: value }));
  };

  return (
    <main className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">Hackathon energy simulator</p>
          <h1>Watt-If?</h1>
          <p>
            Become the Minister of Energy. Stress-test a national grid against heatwaves, wind droughts,
            EV growth, nuclear outages, and gas shocks.
          </p>
        </div>
        <button className="reset-button" onClick={() => setState(initialState)}>
          <RotateCcw size={16} /> Reset grid
        </button>
      </header>

      <section className="metrics-grid">
        <MetricCard label="Reliability" value={`${metrics.reliability}%`} detail={`${metrics.supply} GW supply / ${metrics.demand} GW demand`} tone={metrics.reliability > 94 ? 'good' : metrics.reliability > 82 ? 'warn' : 'bad'} />
        <MetricCard label="Blackout risk" value={`${metrics.blackoutRisk}%`} detail="Probability under current stress" tone={metrics.blackoutRisk < 10 ? 'good' : metrics.blackoutRisk < 35 ? 'warn' : 'bad'} />
        <MetricCard label="Carbon intensity" value={`${metrics.carbon} gCO₂/kWh`} detail="Weighted by energy mix" tone={metrics.carbon < 120 ? 'good' : metrics.carbon < 220 ? 'warn' : 'bad'} />
        <MetricCard label="Electricity price" value={`€${metrics.price.toFixed(2)}/kWh`} detail="Includes scarcity penalty" tone={metrics.price < 0.22 ? 'good' : metrics.price < 0.34 ? 'warn' : 'bad'} />
        <MetricCard label="Public approval" value={`${metrics.approval}%`} detail="Citizens reward clean, cheap reliability" tone={metrics.approval > 70 ? 'good' : metrics.approval > 45 ? 'warn' : 'bad'} />
      </section>

      <div className="dashboard">
        <aside className="controls-stack">
          <SliderGroup title="Energy production" controls={productionControls} state={state} onChange={updateState} />
          <SliderGroup title="Demand pressure" controls={demandControls} state={state} onChange={updateState} />
          <SliderGroup title="Climate events" controls={eventControls} state={state} onChange={updateState} />
        </aside>

        <div className="main-stage">
          <GridMap status={metrics.status} reliability={metrics.reliability} />

          <section className="panel advisor">
            <div className="advisor-title">
              <Activity />
              <div>
                <p className="eyebrow">Chief Energy Advisor</p>
                <h2>Situation report</h2>
              </div>
            </div>
            <p>{advisorMessage}</p>
          </section>
        </div>

        <aside className="panel scenarios-panel">
          <h2>Disaster scenarios</h2>
          <p className="muted">Click a card to rewrite the future.</p>
          <div className="scenario-list">
            {scenarios.map((scenario) => (
              <button key={scenario.name} className="scenario-card" onClick={() => setState((current) => ({ ...current, ...scenario.patch }))}>
                <span className="scenario-icon">{scenario.icon}</span>
                <strong>{scenario.name}</strong>
                <small>{scenario.description}</small>
              </button>
            ))}
          </div>
        </aside>
      </div>

      <footer className="footer-note">
        <Zap size={16} /> Phase 1 MVP: sliders, scenarios, live metrics, map, and advisor logic. Next: yearly turns and budget gameplay.
      </footer>
    </main>
  );
}
