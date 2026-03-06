import { ERarity } from '../sheep.interface';

export interface IRarityConfig {
  rarity: ERarity;
  minRoll: number;
}

export interface IStatConfig {
  minStatIndividual: number;
  maxStatIndividual: number;
  statDispersionRate: number;
}

export interface ISheepOrderCostConfig {
  chip: number;
  cash: number;
  time: number;
}

export interface IOrderCostConfig {
  sheep: ISheepOrderCostConfig;
}

export interface ICostConfig {
  orders: IOrderCostConfig;
}

export interface ISheepGenerationConfig {
  rarityConfig: IRarityConfig[];
  statConfig: IStatConfig;
}

export interface IInitialCurrencyConfig {
  chip: number;
  cash: number;
}

export interface IUserConfig {
  initialCurrency: IInitialCurrencyConfig;
}

export interface IConfigurations {
  costs: ICostConfig;
  sheepGeneration: ISheepGenerationConfig;
  user: IUserConfig;
}

export const CONFIGURATIONS: IConfigurations = {
  costs: {
    orders: {
      sheep: {
        chip: 100,
        cash: 10,
        time: 15,
      },
    },
  },
  sheepGeneration: {
    rarityConfig: [
      { rarity: ERarity.Legendary, minRoll: 99 },
      { rarity: ERarity.Epic, minRoll: 90 },
      { rarity: ERarity.Rare, minRoll: 75 },
      { rarity: ERarity.Uncommon, minRoll: 40 },
      { rarity: ERarity.Common, minRoll: 0 },
    ],
    statConfig: {
      minStatIndividual: 50,
      maxStatIndividual: 500,
      statDispersionRate: 25,
    },
  },
  user: {
    initialCurrency: {
      chip: 500,
      cash: 50,
    },
  },
};
