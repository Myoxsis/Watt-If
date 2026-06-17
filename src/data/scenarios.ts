import type { EnergyState } from '../lib/simulator';

export type Scenario = {
  name: string;
  icon: string;
  description: string;
  patch: Partial<EnergyState>;
};

export const scenarios: Scenario[] = [
  {
    name: 'Mega Heatwave',
    icon: '🌡️',
    description: 'Cooling demand surges across cities.',
    patch: { heatwave: 88, airConditioning: 85 },
  },
  {
    name: 'Windless Week',
    icon: '💨',
    description: 'Wind farms produce far below normal.',
    patch: { windDrought: 82 },
  },
  {
    name: 'Gas Import Crisis',
    icon: '🛢️',
    description: 'Gas availability collapses after a supply shock.',
    patch: { gas: 8 },
  },
  {
    name: 'EV Explosion',
    icon: '🚗',
    description: 'Millions of vehicles plug into the grid.',
    patch: { evAdoption: 92 },
  },
  {
    name: 'Nuclear Outage',
    icon: '⚛️',
    description: 'Half the nuclear fleet is offline for maintenance.',
    patch: { nuclear: 32 },
  },
  {
    name: 'Green Transition 2040',
    icon: '🌱',
    description: 'Massive renewables and storage buildout.',
    patch: { solar: 88, wind: 86, batteries: 78, gas: 10 },
  },
];
