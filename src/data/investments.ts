import type { EnergyState } from '../lib/simulator';

export type Investment = {
  id: string;
  name: string;
  icon: string;
  cost: number;
  description: string;
  patch: Partial<EnergyState>;
};

export const investments: Investment[] = [
  {
    id: 'solar',
    name: 'Build solar farms',
    icon: '☀️',
    cost: 18,
    description: 'Cheap clean energy, but weak at peak without storage.',
    patch: { solar: 12 },
  },
  {
    id: 'wind',
    name: 'Expand wind fleet',
    icon: '💨',
    cost: 22,
    description: 'Strong low-carbon production, vulnerable to wind droughts.',
    patch: { wind: 12 },
  },
  {
    id: 'batteries',
    name: 'Install grid batteries',
    icon: '🔋',
    cost: 20,
    description: 'Improves peak coverage and absorbs renewable volatility.',
    patch: { batteries: 14 },
  },
  {
    id: 'nuclear',
    name: 'Commission nuclear units',
    icon: '⚛️',
    cost: 35,
    description: 'Expensive firm low-carbon capacity with strong reliability.',
    patch: { nuclear: 10 },
  },
  {
    id: 'hydro',
    name: 'Upgrade hydro storage',
    icon: '💧',
    cost: 24,
    description: 'Flexible low-carbon supply, but limited by drought.',
    patch: { hydro: 8, batteries: 4 },
  },
  {
    id: 'efficiency',
    name: 'Efficiency retrofit',
    icon: '🏠',
    cost: 16,
    description: 'Cuts cooling and industrial demand pressure.',
    patch: { airConditioning: -8, industry: -5 },
  },
];
