import type { EnergyState } from '../lib/simulator';

export type Scenario = {
  name: string;
  icon: string;
  category: 'Climate' | 'Demand' | 'Supply' | 'Transition';
  severity: 'Medium' | 'High' | 'Extreme';
  description: string;
  narrative: string;
  patch: Partial<EnergyState>;
};

export const scenarios: Scenario[] = [
  {
    name: 'Mega Heatwave',
    icon: '🌡️',
    category: 'Climate',
    severity: 'Extreme',
    description: 'Cooling demand surges across cities.',
    narrative: 'A stagnant heat dome pushes air-conditioning demand to record highs while citizens expect uninterrupted power.',
    patch: { heatwave: 88, airConditioning: 85 },
  },
  {
    name: 'Windless Week',
    icon: '💨',
    category: 'Climate',
    severity: 'High',
    description: 'Wind farms produce far below normal.',
    narrative: 'A continent-wide calm reduces wind generation during evening peaks and exposes flexibility gaps.',
    patch: { windDrought: 82 },
  },
  {
    name: 'Gas Import Crisis',
    icon: '🛢️',
    category: 'Supply',
    severity: 'Extreme',
    description: 'Gas availability collapses after a supply shock.',
    narrative: 'Pipeline imports are disrupted overnight, forcing the grid to survive with less fossil backup.',
    patch: { gas: 8 },
  },
  {
    name: 'EV Explosion',
    icon: '🚗',
    category: 'Demand',
    severity: 'High',
    description: 'Millions of vehicles plug into the grid.',
    narrative: 'A subsidy boom accelerates EV adoption, adding large flexible but unmanaged charging demand.',
    patch: { evAdoption: 92 },
  },
  {
    name: 'Nuclear Outage',
    icon: '⚛️',
    category: 'Supply',
    severity: 'High',
    description: 'Half the nuclear fleet is offline for maintenance.',
    narrative: 'Unexpected corrosion checks shut down reactors during a tight winter planning window.',
    patch: { nuclear: 32 },
  },
  {
    name: 'Green Transition 2040',
    icon: '🌱',
    category: 'Transition',
    severity: 'Medium',
    description: 'Massive renewables and storage buildout.',
    narrative: 'A decade of clean-energy investment transforms the power system with solar, wind, and batteries.',
    patch: { solar: 88, wind: 86, batteries: 78, gas: 10 },
  },
  {
    name: 'Data Center Boom',
    icon: '🧠',
    category: 'Demand',
    severity: 'High',
    description: 'AI infrastructure drives industrial electricity demand upward.',
    narrative: 'New data centers request constant power, increasing baseload demand and public debate over priorities.',
    patch: { industry: 92, evAdoption: 45 },
  },
  {
    name: 'Drought Summer',
    icon: '🏜️',
    category: 'Climate',
    severity: 'High',
    description: 'Hydro output falls and cooling stress rises.',
    narrative: 'River levels drop, hydro reservoirs shrink, and thermal plants face cooling constraints during hot weeks.',
    patch: { drought: 86, heatwave: 58, hydro: 11 },
  },
];
