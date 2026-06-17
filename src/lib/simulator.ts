export type EnergyState = {
  nuclear: number;
  solar: number;
  wind: number;
  hydro: number;
  gas: number;
  batteries: number;
  evAdoption: number;
  airConditioning: number;
  industry: number;
  heatwave: number;
  drought: number;
  windDrought: number;
};

export type Metrics = {
  supply: number;
  demand: number;
  reliability: number;
  blackoutRisk: number;
  carbon: number;
  price: number;
  approval: number;
  status: 'Stable' | 'Stressed' | 'Blackout risk';
};

export const initialState: EnergyState = {
  nuclear: 65,
  solar: 24,
  wind: 32,
  hydro: 18,
  gas: 28,
  batteries: 14,
  evAdoption: 25,
  airConditioning: 20,
  industry: 55,
  heatwave: 0,
  drought: 0,
  windDrought: 0,
};

const carbonFactors = {
  nuclear: 12,
  solar: 45,
  wind: 11,
  hydro: 24,
  gas: 490,
};

const costFactors = {
  nuclear: 70,
  solar: 45,
  wind: 55,
  hydro: 60,
  gas: 120,
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function simulate(state: EnergyState): Metrics {
  const solarAvailability = clamp(1 - state.heatwave * 0.0015, 0.75, 1.05);
  const windAvailability = clamp(1 - state.windDrought * 0.008, 0.15, 1);
  const hydroAvailability = clamp(1 - state.drought * 0.006, 0.35, 1);

  const production = {
    nuclear: state.nuclear * 1.05,
    solar: state.solar * solarAvailability,
    wind: state.wind * windAvailability,
    hydro: state.hydro * hydroAvailability,
    gas: state.gas,
  };

  const storageSupport = state.batteries * 0.45;
  const supply = Object.values(production).reduce((sum, value) => sum + value, 0) + storageSupport;
  const demand = 92 + state.evAdoption * 0.35 + state.airConditioning * 0.32 + state.industry * 0.42 + state.heatwave * 0.34;

  const supplyDemandRatio = supply / demand;
  const reliability = clamp(supplyDemandRatio * 100, 0, 100);
  const blackoutRisk = clamp((1 - supplyDemandRatio) * 160, 0, 100);

  const weightedCarbon =
    production.nuclear * carbonFactors.nuclear +
    production.solar * carbonFactors.solar +
    production.wind * carbonFactors.wind +
    production.hydro * carbonFactors.hydro +
    production.gas * carbonFactors.gas;

  const carbon = Math.round(weightedCarbon / Math.max(1, supply - storageSupport));

  const weightedCost =
    production.nuclear * costFactors.nuclear +
    production.solar * costFactors.solar +
    production.wind * costFactors.wind +
    production.hydro * costFactors.hydro +
    production.gas * costFactors.gas;

  const scarcityPenalty = blackoutRisk * 1.8;
  const price = Math.round((weightedCost / Math.max(1, supply - storageSupport) + scarcityPenalty) / 10) / 100;

  const approval = Math.round(
    clamp(100 - blackoutRisk * 0.85 - Math.max(0, price - 0.18) * 130 - Math.max(0, carbon - 120) * 0.12, 0, 100),
  );

  const status = reliability >= 95 ? 'Stable' : reliability >= 82 ? 'Stressed' : 'Blackout risk';

  return {
    supply: Math.round(supply),
    demand: Math.round(demand),
    reliability: Math.round(reliability),
    blackoutRisk: Math.round(blackoutRisk),
    carbon,
    price,
    approval,
    status,
  };
}

export function buildAdvisorMessage(state: EnergyState, metrics: Metrics): string {
  if (metrics.status === 'Stable' && metrics.carbon < 120) {
    return 'Minister, the grid is stable and relatively clean. Your current mix balances firm capacity with renewables, so citizens see low blackout risk and acceptable prices.';
  }

  if (metrics.blackoutRisk > 45) {
    return 'Minister, the system is approaching emergency conditions. Demand is outrunning available supply; add firm generation, storage, or reduce stress from EV charging and cooling.';
  }

  if (metrics.carbon > 220) {
    return 'Minister, reliability is being protected by gas generation, but emissions are climbing fast. Replace gas with nuclear, wind, solar plus batteries, or demand reduction.';
  }

  if (state.windDrought > 55) {
    return 'Minister, the wind drought exposed a flexibility problem. Batteries and dispatchable low-carbon capacity would help the grid survive low-renewable periods.';
  }

  if (state.heatwave > 60) {
    return 'Minister, the heatwave is pushing cooling demand upward. Efficiency investments or demand response would lower peak load and protect public approval.';
  }

  return 'Minister, the grid is functional but fragile. Small changes in weather or demand could create stress, so the safest move is improving storage and supply diversity.';
}
