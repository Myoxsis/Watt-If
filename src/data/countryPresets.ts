import { simulate, type EnergyState } from '../lib/simulator';

export type CountryPreset = {
  id: 'france' | 'germany' | 'sweden';
  name: string;
  flag: string;
  description: string;
  sourceNote: string;
  sourceUrl: string;
  state: EnergyState;
};

export const countryPresets: CountryPreset[] = [
  {
    id: 'france',
    name: 'France',
    flag: 'FR',
    description: 'Nuclear-heavy, reliable, low-carbon baseline with moderate hydro, wind, and solar.',
    sourceNote: 'Inspired by IEA and Ember country electricity profiles: France is structurally nuclear-heavy and low-carbon.',
    sourceUrl: 'https://ember-energy.org/data/electricity-data-explorer/',
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
    flag: 'DE',
    description: 'Renewables-heavy industrial system with no nuclear and more fossil backup flexibility.',
    sourceNote: 'Inspired by AGEB, Energy Institute, and Ember profiles showing high wind/solar share, no nuclear, and gas/coal backup.',
    sourceUrl: 'https://ember-energy.org/data/electricity-data-explorer/',
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
    flag: 'SE',
    description: 'Hydro, nuclear, and wind create a resilient low-carbon system with little fossil generation.',
    sourceNote: 'Inspired by Energy Institute and national profiles: Sweden is dominated by hydro, nuclear, and wind.',
    sourceUrl: 'https://ember-energy.org/data/electricity-data-explorer/',
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
