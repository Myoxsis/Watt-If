import { toPng } from 'html-to-image';
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
          <p className="eyebrow">Dataset presets</p>
          <h2>Real-world inspired grids</h2>
        </div>
      </div>
      <div className="preset-list">
        {countryPresets.map((preset) => (
          <button className="preset-card" key={preset.id} onClick={() => onApply(preset)}>
            <span>{preset.flag}</span>
            <strong>{preset.name}</strong>
            <small>{preset.description}</small>
            <em>{preset.sourceNote}</em>
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
          <p className="eyebrow">Benchmark comparison</p>
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
              <span>CO2 {country.metrics.carbon}g</span>
              <span>Price EUR {country.metrics.price.toFixed(2)}</span>
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
    if (!target) {
      window.alert('Export target was not found. Try refreshing the app.');
      return;
    }

    try {
      const dataUrl = await toPng(target, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#070b16',
        filter: (node) => !(node instanceof HTMLElement && node.classList.contains('event-toast')),
      });

      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'watt-if-scenario.png';
      link.click();
    } catch (error) {
      console.error('Failed to export scenario image', error);
      window.alert('The scenario image could not be exported. Try closing modals and exporting again.');
    }
  };

  return (
    <section className="panel phase7-panel export-panel">
      <div className="advisor-title">
        <Camera />
        <div>
          <p className="eyebrow">Scenario export</p>
          <h2>Export scenario image</h2>
        </div>
      </div>
      <p className="muted">Downloads the current presentation summary as a high-resolution PNG for slides, judging, or sharing.</p>
      <button className="next-year-button" onClick={exportImage}>Export PNG</button>
    </section>
  );
}

export function applyPresetState(preset: CountryPreset): EnergyState {
  return { ...preset.state };
}
