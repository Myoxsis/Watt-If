import { Camera, Database, GitCompareArrows } from 'lucide-react';
import { countryBenchmarks, countryPresets, type CountryPreset } from '../data/countryPresets';
import type { EnergyState, Metrics } from '../lib/simulator';

function closeness(a: number, b: number, lowerIsBetter = false) {
  const distance = Math.abs(a - b);
  const score = Math.max(0, 100 - distance * (lowerIsBetter ? 0.7 : 1));
  return Math.round(score);
}

export function PresetPanel({ onApply }: { onApply: (preset: CountryPreset) => void }) {
  return (
    <section className="panel phase7-panel">
      <div className="advisor-title">
        <Database />
        <div>
          <p className="eyebrow">Phase 7 presets</p>
          <h2>Real-world inspired grids</h2>
        </div>
      </div>
      <div className="preset-list">
        {countryPresets.map((preset) => (
          <button className="preset-card" key={preset.id} onClick={() => onApply(preset)}>
            <span>{preset.flag}</span>
            <strong>{preset.name}</strong>
            <small>{preset.description}</small>
          </button>
        ))}
      </div>
    </section>
  );
}

export function BenchmarkPanel({ metrics }: { metrics: Metrics }) {
  const closest = countryBenchmarks
    .map((country) => ({
      ...country,
      match:
        Math.round(
          (closeness(metrics.carbon, country.metrics.carbon, true) +
            closeness(metrics.price * 100, country.metrics.price * 100, true) +
            closeness(metrics.reliability, country.metrics.reliability) +
            closeness(metrics.renewableShare, country.metrics.renewableShare)) /
            4,
        ),
    }))
    .sort((a, b) => b.match - a.match);

  return (
    <section className="panel phase7-panel">
      <div className="advisor-title">
        <GitCompareArrows />
        <div>
          <p className="eyebrow">Phase 7 comparison</p>
          <h2>Compare to country benchmarks</h2>
        </div>
      </div>
      <div className="benchmark-list">
        {closest.map((country) => (
          <article className="benchmark-card" key={country.id}>
            <div>
              <strong>{country.flag} {country.name}</strong>
              <small>{country.match}% similar to your grid</small>
            </div>
            <div className="benchmark-grid">
              <span>Score {country.metrics.score}</span>
              <span>CO₂ {country.metrics.carbon}g</span>
              <span>Price €{country.metrics.price.toFixed(2)}</span>
              <span>Reliability {country.metrics.reliability}%</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function ExportPanel({ targetId }: { targetId: string }) {
  const exportImage = async () => {
    const target = document.getElementById(targetId);
    if (!target) return;

    const rect = target.getBoundingClientRect();
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${rect.width}" height="${rect.height}">
        <foreignObject width="100%" height="100%">
          <div xmlns="http://www.w3.org/1999/xhtml" style="background:#070b16;color:white;font-family:Inter,Arial,sans-serif;padding:24px;width:${rect.width}px;height:${rect.height}px;box-sizing:border-box;">
            ${target.innerHTML}
          </div>
        </foreignObject>
      </svg>`;

    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'watt-if-scenario.svg';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="panel phase7-panel export-panel">
      <div className="advisor-title">
        <Camera />
        <div>
          <p className="eyebrow">Phase 7 export</p>
          <h2>Export scenario image</h2>
        </div>
      </div>
      <p className="muted">Downloads the current presentation summary as an SVG image for slides, judging, or sharing.</p>
      <button className="next-year-button" onClick={exportImage}>Export current scenario</button>
    </section>
  );
}

export function applyPresetState(preset: CountryPreset): EnergyState {
  return { ...preset.state };
}
