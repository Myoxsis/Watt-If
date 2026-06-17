import { simulate, type EnergyState } from '../lib/simulator';

export type CountryPreset = {
  id: 'france' | 'germany' | 'sweden';
  name: string;
  flag: string;
  description: string;
  state: EnergyState;
};

export const countryPresets: CountryPreset[] = [
  {
    id: 'france',
    name: 'France',
    flag: '🇫🇷',
    description: 'Nuclear-heavy, reliable, low-carbon baseline with moderate renewables.',
    state: {
      nuclear: 82,
      solar: 28,
      wind: 34,
      hydro: 26,
      gas: 14,
      batteries: 12,
      evAdoption: 32,
      airConditioning: 18,
      industry: 54,
      heatwave: 0,
      drought: 0,
      windDrought: 0,
    },
  },
  {
    id: 'germany',
    name: 'Germany',
    flag: '🇩🇪',
    description: 'Renewables-heavy industrial system with more gas backup and peak pressure.',
    state: {
      nuclear: 0,
      solar: 78,
      wind: 82,
      hydro: 10,
      gas: 42,
      batteries: 22,
      evAdoption: 38,
      airConditioning: 16,
      industry: 78,
      heatwave: 0,
      drought: 0,
      windDrought: 0,
    },
  },
  {
    id: 'sweden',
    name: 'Sweden',
    flag: '🇸🇪',
    description: 'Hydro, nuclear, and wind create a resilient low-carbon system.',
    state: {
      nuclear: 42,
      solar: 14,
      wind: 56,
      hydro: 72,
      gas: 4,
      batteries: 18,
      evAdoption: 48,
      airConditioning: 8,
      industry: 58,
      heatwave: 0,
      drought: 0,
      windDrought: 0,
    },
  },
];

export const countryBenchmarks = countryPresets.map((preset) => ({
  ...preset,
  metrics: simulate(preset.state),
}));
