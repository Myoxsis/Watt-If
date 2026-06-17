import { Play, SkipForward } from 'lucide-react';

export type DemoStep = {
  title: string;
  description: string;
};

export const guidedDemoSteps: DemoStep[] = [
  {
    title: 'Load France baseline',
    description: 'Start from a reliable low-carbon nuclear-heavy grid.',
  },
  {
    title: 'Trigger mega heatwave',
    description: 'Stress cooling demand and show blackout risk rising.',
  },
  {
    title: 'Invest in batteries',
    description: 'Improve peak coverage and storage flexibility.',
  },
  {
    title: 'Compare and export',
    description: 'Show benchmark similarity and export the judge-ready PNG.',
  },
];

export function GuidedDemo({ currentStep, onStart, onNext }: { currentStep: number; onStart: () => void; onNext: () => void }) {
  const step = guidedDemoSteps[Math.min(currentStep, guidedDemoSteps.length - 1)];

  return (
    <section className="panel guided-demo-panel">
      <div className="advisor-title">
        <Play />
        <div>
          <p className="eyebrow">Guided demo</p>
          <h2>{step.title}</h2>
        </div>
      </div>
      <p className="muted">{step.description}</p>
      <div className="demo-progress" aria-label="Guided demo progress">
        {guidedDemoSteps.map((item, index) => (
          <span className={index <= currentStep ? 'active' : ''} key={item.title} />
        ))}
      </div>
      <div className="demo-actions">
        <button className="ghost-button" onClick={onStart}><Play size={16} /> Restart demo</button>
        <button className="next-year-button" onClick={onNext}><SkipForward size={16} /> Next demo step</button>
      </div>
    </section>
  );
}
