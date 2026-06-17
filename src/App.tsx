import { useMemo, useState } from 'react';
import { Activity, BarChart3, Gauge, RotateCcw, Zap } from 'lucide-react';
import { scenarios } from './data/scenarios';
import { buildAdvisorMessage, initialState, simulate, type EnergyState, type Metrics } from './lib/simulator';

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

function tone(value: number, good: number, warn: number, direction: 'higher' | 'lower' = 'higher') {
  if (direction === 'higher') return value >= good ? 'good' : value >= warn ? 'warn' : 'bad';
  return value <= good ? 'good' : value <= warn ? 'warn' : 'bad';
}

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

function GridMap({ metrics }: { metrics: Metrics }) {
  const cityClass = metrics.status === 'Stable' ? 'city stable' : metrics.status === 'Stressed' ? 'city stressed' : 'city danger';

  return (
    <section className="map-card">
      <div className="map-header">
        <div>
          <p className="eyebrow">Live grid map</p>
          <h2>France energy system</h2>
        </div>
        <span className={`status-pill ${metrics.status === 'Stable' ? 'good' : metrics.status === 'Stressed' ? 'warn' : 'bad'}`}>{metrics.status}</span>
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
          {metrics.reliability}% reliability · {metrics.reserveMargin}% reserve
        </div>
      </div>
    </section>
  );
}

function Breakdown({ metrics }: { metrics: Metrics }) {
  const entries = Object.entries(metrics.production) as Array<[keyof Metrics['production'], number]>;
  const max = Math.max(...entries.map(([, value]) => value), 1);

  return (
    <section className="panel breakdown">
      <div className="advisor-title">
        <BarChart3 />
        <div>
          <p className="eyebrow">Phase 2 model</p>
          <h2>Production breakdown</h2>
        </div>
      </div>
      <div className="bars">
        {entries.map(([name, value]) => (
          <div className="bar-row" key={name}>
            <span>{name}</span>
            <div className="bar-track">
              <div className="bar-fill" style={{ width: `${Math.max(5, (value / max) * 100)}%` }} />
            </div>
            <strong>{value} GW</strong>
          </div>
        ))}
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
            Become the Minister of Energy. Stress-test a national grid against peak demand, renewable intermittency,
            storage limits, heatwaves, wind droughts, EV growth, nuclear outages, and gas shocks.
          </p>
        </div>
        <button className="reset-button" onClick={() => setState(initialState)}>
          <RotateCcw size={16} /> Reset grid
        </button>
      </header>

      <section className="metrics-grid phase-two">
        <MetricCard label="Grid score" value={`${metrics.score}/100`} detail="Reliability + carbon + price + approval" tone={tone(metrics.score, 76, 54)} />
        <MetricCard label="Reliability" value={`${metrics.reliability}%`} detail={`${metrics.supply} GW supply / ${metrics.peakDemand} GW peak`} tone={tone(metrics.reliability, 94, 80)} />
        <MetricCard label="Reserve margin" value={`${metrics.reserveMargin}%`} detail="Extra capacity above peak load" tone={tone(metrics.reserveMargin, 10, 0)} />
        <MetricCard label="Unserved energy" value={`${metrics.unservedEnergy} GW`} detail="Demand not covered at peak" tone={tone(metrics.unservedEnergy, 0, 8, 'lower')} />
        <MetricCard label="Renewable share" value={`${metrics.renewableShare}%`} detail={`${metrics.renewableSupply} GW renewable output`} tone={tone(metrics.renewableShare, 55, 30)} />
        <MetricCard label="Storage coverage" value={`${metrics.storageCoverage}%`} detail="Battery support during peak stress" tone={tone(metrics.storageCoverage, 65, 30)} />
        <MetricCard label="Blackout risk" value={`${metrics.blackoutRisk}%`} detail="Probability under current stress" tone={tone(metrics.blackoutRisk, 10, 35, 'lower')} />
        <MetricCard label="Carbon intensity" value={`${metrics.carbon} gCO₂/kWh`} detail="Weighted by energy mix" tone={tone(metrics.carbon, 120, 220, 'lower')} />
        <MetricCard label="Electricity price" value={`€${metrics.price.toFixed(2)}/kWh`} detail="Includes scarcity penalty" tone={tone(metrics.price, 0.22, 0.34, 'lower')} />
        <MetricCard label="Public approval" value={`${metrics.approval}%`} detail="Citizens reward clean, cheap reliability" tone={tone(metrics.approval, 70, 45)} />
      </section>

      <div className="dashboard">
        <aside className="controls-stack">
          <SliderGroup title="Energy production" controls={productionControls} state={state} onChange={updateState} />
          <SliderGroup title="Demand pressure" controls={demandControls} state={state} onChange={updateState} />
          <SliderGroup title="Climate events" controls={eventControls} state={state} onChange={updateState} />
        </aside>

        <div className="main-stage">
          <GridMap metrics={metrics} />

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

          <Breakdown metrics={metrics} />
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
        <Zap size={16} /> Phase 2: richer supply-demand engine, intermittency, storage support, peak stress, blackout risk, and grid scoring.
      </footer>
    </main>
  );
}
