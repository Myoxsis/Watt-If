import { BatteryCharging, Coins, HeartPulse, ShieldCheck, Star, Zap } from 'lucide-react';
import { investments, type Investment } from '../data/investments';
import type { Metrics } from '../lib/simulator';

function gradeFromScore(score: number) {
  if (score >= 85) return 'A';
  if (score >= 75) return 'B+';
  if (score >= 60) return 'B';
  if (score >= 45) return 'C';
  return 'D';
}

export function GameHud({ year, budget, metrics }: { year: number; budget: number; metrics: Metrics }) {
  return (
    <section className="game-hud" aria-label="Game status HUD">
      <div className="game-logo">
        <strong>Watt-If?</strong>
        <span>Energy. Decisions. Consequences.</span>
      </div>
      <div className="hud-pill"><Zap size={18} /><span>Year</span><strong>{year}</strong></div>
      <div className="hud-pill"><Coins size={18} /><span>Budget</span><strong>EUR {budget}B</strong></div>
      <div className="hud-pill"><HeartPulse size={18} /><span>Popularity</span><strong>{metrics.approval}%</strong></div>
      <div className="hud-pill grade"><Star size={18} /><span>Energy score</span><strong>{gradeFromScore(metrics.score)}</strong></div>
      <div className="hud-health"><ShieldCheck size={18} /><span>Grid health</span><meter min="0" max="100" value={metrics.reliability} /><strong>{metrics.reliability}%</strong></div>
    </section>
  );
}

export function CrisisActionPanel({ latestEventName, metrics, onNextYear }: { latestEventName?: string; metrics: Metrics; onNextYear: () => void }) {
  return (
    <section className="crisis-action-window">
      <div className="crisis-title"><span>!</span><div><strong>CRISIS</strong><small>{latestEventName ?? 'No active crisis'}</small></div></div>
      <div className="crisis-art"><div className="sun-core" /><span>Demand surge</span></div>
      <div className="crisis-effects">
        <span>Blackout risk {metrics.blackoutRisk}%</span>
        <span>Reserve margin {metrics.reserveMargin}%</span>
        <span>Unserved {metrics.unservedEnergy} GW</span>
      </div>
      <button className="primary-game-action" onClick={onNextYear}>End turn</button>
    </section>
  );
}

export function BuildDeck({ budget, onInvest }: { budget: number; onInvest: (investment: Investment) => void }) {
  return (
    <section className="build-deck" aria-label="Build cards">
      {investments.slice(0, 6).map((investment) => {
        const disabled = budget < investment.cost;
        return (
          <button className={`build-card ${investment.id}`} disabled={disabled} key={investment.id} onClick={() => onInvest(investment)}>
            <span className="build-tag">Build</span>
            <strong>{investment.name.replace('Build ', '').replace('Install ', '')}</strong>
            <small>{investment.description}</small>
            <div className="build-meta"><BatteryCharging size={16} /><span>EUR {investment.cost}B</span></div>
          </button>
        );
      })}
    </section>
  );
}

export function BottomStatBar({ metrics }: { metrics: Metrics }) {
  return (
    <section className="bottom-stat-bar">
      <div><span>CO2 intensity</span><strong>{metrics.carbon}</strong><small>gCO2/kWh</small></div>
      <div><span>Unserved energy</span><strong>{metrics.unservedEnergy}%</strong><small>peak stress</small></div>
      <div><span>Electricity price</span><strong>EUR {metrics.price.toFixed(2)}</strong><small>/kWh</small></div>
      <div><span>Renewable share</span><strong>{metrics.renewableShare}%</strong><small>current mix</small></div>
      <div><span>Reliability</span><strong>{metrics.reliability}%</strong><small>grid health</small></div>
    </section>
  );
}
