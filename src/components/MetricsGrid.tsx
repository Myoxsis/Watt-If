import type { Metrics } from '../lib/simulator';

function tone(value: number, good: number, warn: number, direction: 'higher' | 'lower' = 'higher') {
  if (direction === 'higher') return value >= good ? 'good' : value >= warn ? 'warn' : 'bad';
  return value <= good ? 'good' : value <= warn ? 'warn' : 'bad';
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

export function MetricsGrid({ metrics }: { metrics: Metrics }) {
  return (
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
  );
}
