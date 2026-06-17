import { AlertTriangle, Award, RadioTower, Sparkles } from 'lucide-react';
import type { Metrics } from '../lib/simulator';

export function VisualStatusStrip({
  metrics,
  year,
  latestEventName,
}: {
  metrics: Metrics;
  year: number;
  latestEventName?: string;
}) {
  const mood = metrics.status === 'Stable' ? 'calm' : metrics.status === 'Stressed' ? 'alert' : 'danger';

  return (
    <section className={`visual-status-strip ${mood}`}>
      <div className="visual-status-copy">
        <p className="eyebrow">Phase 6 presentation layer</p>
        <h2>{metrics.status === 'Stable' ? 'The grid is breathing.' : metrics.status === 'Stressed' ? 'The grid is under pressure.' : 'Cities are at blackout risk.'}</h2>
        <p>
          {latestEventName
            ? `Latest shock: ${latestEventName}. Current year: ${year}.`
            : `Current year: ${year}. Run a crisis or end the year to see the grid react.`}
        </p>
      </div>
      <div className="grid-pulse-orb" aria-hidden="true">
        <RadioTower />
      </div>
      <div className="visual-status-kpis">
        <span>Score {metrics.score}</span>
        <span>Risk {metrics.blackoutRisk}%</span>
        <span>CO₂ {metrics.carbon}g</span>
      </div>
    </section>
  );
}

export function EventToast({ latestEventName, latestEventIcon }: { latestEventName?: string; latestEventIcon?: string }) {
  if (!latestEventName) return null;

  return (
    <aside className="event-toast" role="status">
      <AlertTriangle size={18} />
      <div>
        <strong>{latestEventIcon} Crisis triggered</strong>
        <span>{latestEventName}</span>
      </div>
    </aside>
  );
}

export function ReportCardPreview({ metrics }: { metrics: Metrics }) {
  const grade = metrics.score >= 85 ? 'A' : metrics.score >= 75 ? 'B' : metrics.score >= 60 ? 'C' : metrics.score >= 45 ? 'D' : 'F';
  const verdict =
    metrics.score >= 75 && metrics.reliability >= 90
      ? 'Winning transition path'
      : metrics.blackoutRisk > 35
        ? 'Fragile under crisis'
        : 'Promising but incomplete';

  return (
    <section className="panel report-card-preview">
      <div className="advisor-title">
        <Award />
        <div>
          <p className="eyebrow">Live report card</p>
          <h2>Judge-ready summary</h2>
        </div>
      </div>
      <div className="grade-badge">{grade}</div>
      <p>{verdict}</p>
      <div className="report-rubric">
        <span>Reliability {metrics.reliability}%</span>
        <span>Affordability €{metrics.price.toFixed(2)}/kWh</span>
        <span>Sustainability {metrics.carbon} gCO₂/kWh</span>
        <span>Public approval {metrics.approval}%</span>
      </div>
    </section>
  );
}

export function DemoCueCard() {
  return (
    <section className="panel demo-cue-card">
      <div className="advisor-title">
        <Sparkles />
        <div>
          <p className="eyebrow">Demo cue</p>
          <h2>60-second story</h2>
        </div>
      </div>
      <ol>
        <li>Show the healthy starting grid.</li>
        <li>Trigger a heatwave or wind drought.</li>
        <li>Point to the impact panel and blackout risk.</li>
        <li>Invest in batteries, wind, or nuclear.</li>
        <li>End with the report-card grade.</li>
      </ol>
    </section>
  );
}
