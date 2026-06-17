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

export type ProductionBreakdown = {
  nuclear: number;
  solar: number;
  wind: number;
  hydro: number;
  gas: number;
  batteries: number;
};

export type Metrics = {
  supply: number;
  firmSupply: number;
  renewableSupply: number;
  demand: number;
  peakDemand: number;
  reserveMargin: number;
  reliability: number;
  blackoutRisk: number;
  unservedEnergy: number;
  renewableShare: number;
  storageCoverage: number;
  carbon: number;
  price: number;
  approval: number;
  score: number;
  status: 'Stable' | 'Stressed' | 'Blackout risk';
  production: ProductionBreakdown;
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
  batteries: 8,
};

const costFactors = {
  nuclear: 70,
  solar: 45,
  wind: 55,
  hydro: 60,
  gas: 120,
  batteries: 85,
};

const capacityFactors = {
  nuclear: 0.9,
  solar: 0.28,
  wind: 0.42,
  hydro: 0.5,
  gas: 0.82,
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const round = (value: number) => Math.round(value);

export function simulate(state: EnergyState): Metrics {
  const heatwaveStress = state.heatwave / 100;
  const droughtStress = state.drought / 100;
  const windStress = state.windDrought / 100;

  const solarAvailability = clamp(1.08 - heatwaveStress * 0.18, 0.72, 1.12);
  const windAvailability = clamp(1 - windStress * 0.82, 0.12, 1);
  const hydroAvailability = clamp(1 - droughtStress * 0.68, 0.3, 1);

  const production: ProductionBreakdown = {
    nuclear: state.nuclear * capacityFactors.nuclear,
    solar: state.solar * capacityFactors.solar * solarAvailability,
    wind: state.wind * capacityFactors.wind * windAvailability,
    hydro: state.hydro * capacityFactors.hydro * hydroAvailability,
    gas: state.gas * capacityFactors.gas,
    batteries: 0,
  };

  const baseDemand = 78;
  const evDemand = state.evAdoption * 0.32;
  const coolingDemand = state.airConditioning * 0.28 + state.heatwave * 0.46;
  const industrialDemand = state.industry * 0.38;
  const demand = baseDemand + evDemand + coolingDemand + industrialDemand;

  const peakDemand = demand * (1.08 + heatwaveStress * 0.2 + state.evAdoption * 0.0016);
  const variableRenewables = production.solar + production.wind;
  const firmSupply = production.nuclear + production.hydro + production.gas;
  const flexibilityNeed = Math.max(0, peakDemand - firmSupply - variableRenewables * 0.5);
  const batteryDischarge = clamp(Math.min(state.batteries * 0.72, flexibilityNeed), 0, state.batteries * 0.72);
  production.batteries = batteryDischarge;

  const supply = Object.values(production).reduce((sum, value) => sum + value, 0);
  const renewableSupply = production.solar + production.wind + production.hydro;
  const reserveMargin = ((supply - peakDemand) / Math.max(1, peakDemand)) * 100;
  const unservedEnergy = Math.max(0, peakDemand - supply);

  const reliability = clamp(100 - unservedEnergy * 1.8 - Math.max(0, -reserveMargin) * 0.45, 0, 100);
  const blackoutRisk = clamp(unservedEnergy * 2.6 + Math.max(0, -reserveMargin) * 1.35 + Math.max(0, 12 - state.batteries * 0.18), 0, 100);
  const renewableShare = clamp((renewableSupply / Math.max(1, supply)) * 100, 0, 100);
  const storageCoverage = clamp((batteryDischarge / Math.max(1, peakDemand - demand)) * 100, 0, 100);

  const weightedCarbon =
    production.nuclear * carbonFactors.nuclear +
    production.solar * carbonFactors.solar +
    production.wind * carbonFactors.wind +
    production.hydro * carbonFactors.hydro +
    production.gas * carbonFactors.gas +
    production.batteries * carbonFactors.batteries;

  const carbon = round(weightedCarbon / Math.max(1, supply));

  const weightedCost =
    production.nuclear * costFactors.nuclear +
    production.solar * costFactors.solar +
    production.wind * costFactors.wind +
    production.hydro * costFactors.hydro +
    production.gas * costFactors.gas +
    production.batteries * costFactors.batteries;

  const scarcityPenalty = blackoutRisk * 1.7 + Math.max(0, -reserveMargin) * 1.15;
  const price = Math.round((weightedCost / Math.max(1, supply) + scarcityPenalty) / 10) / 100;

  const approval = round(
    clamp(100 - blackoutRisk * 0.72 - Math.max(0, price - 0.2) * 120 - Math.max(0, carbon - 130) * 0.1, 0, 100),
  );

  const score = round(
    clamp(reliability * 0.38 + approval * 0.2 + (100 - clamp(carbon / 3, 0, 100)) * 0.22 + (100 - clamp(price * 260, 0, 100)) * 0.2, 0, 100),
  );

  const status = reliability >= 94 && reserveMargin >= 6 ? 'Stable' : reliability >= 80 && reserveMargin >= -8 ? 'Stressed' : 'Blackout risk';

  return {
    supply: round(supply),
    firmSupply: round(firmSupply),
    renewableSupply: round(renewableSupply),
    demand: round(demand),
    peakDemand: round(peakDemand),
    reserveMargin: round(reserveMargin),
    reliability: round(reliability),
    blackoutRisk: round(blackoutRisk),
    unservedEnergy: Math.round(unservedEnergy * 10) / 10,
    renewableShare: round(renewableShare),
    storageCoverage: round(storageCoverage),
    carbon,
    price,
    approval,
    score,
    status,
    production: {
      nuclear: round(production.nuclear),
      solar: round(production.solar),
      wind: round(production.wind),
      hydro: round(production.hydro),
      gas: round(production.gas),
      batteries: round(production.batteries),
    },
  };
}

export function buildAdvisorMessage(state: EnergyState, metrics: Metrics): string {
  if (metrics.unservedEnergy > 15) {
    return `Minister, the grid is failing at peak load: ${metrics.unservedEnergy} GW of demand is not served. Add firm capacity, batteries, or reduce cooling and EV demand before the next crisis.`;
  }

  if (metrics.reserveMargin < 0) {
    return `Minister, supply is below peak demand by ${Math.abs(metrics.reserveMargin)}%. The grid may survive average hours, but evening peaks or bad weather can trigger blackouts.`;
  }

  if (metrics.storageCoverage < 35 && state.solar + state.wind > 120) {
    return 'Minister, renewable buildout is strong, but storage is not keeping up. Add batteries so solar and wind can cover peak hours instead of forcing gas backup.';
  }

  if (metrics.carbon > 220) {
    return 'Minister, reliability is being protected by gas generation, but emissions are climbing fast. Replace gas with nuclear, wind, solar plus batteries, or demand reduction.';
  }

  if (metrics.renewableShare > 60 && metrics.reserveMargin > 10) {
    return 'Minister, this is a strong clean-grid configuration. Renewables provide most energy while reserve margin remains healthy enough to absorb shocks.';
  }

  if (state.windDrought > 55) {
    return 'Minister, the wind drought exposed a flexibility problem. Batteries and dispatchable low-carbon capacity would help the grid survive low-renewable periods.';
  }

  if (state.heatwave > 60) {
    return 'Minister, the heatwave is pushing cooling demand upward. Efficiency investments or demand response would lower peak load and protect public approval.';
  }

  if (metrics.status === 'Stable' && metrics.carbon < 120) {
    return 'Minister, the grid is stable and relatively clean. Your current mix balances firm capacity with renewables, so citizens see low blackout risk and acceptable prices.';
  }

  return 'Minister, the grid is functional but fragile. Small changes in weather or demand could create stress, so the safest move is improving storage and supply diversity.';
}
