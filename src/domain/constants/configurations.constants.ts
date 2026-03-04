import { ERarity } from '../sheep.interface';

export interface IRarityConfig {
  rarity: ERarity;
  minRoll: number;
}

export interface IStatConfig {
  minStatTotal: number;
  maxStatTotal: number;
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
  maxRoll: number;
  rarityConfig: IRarityConfig[];
  statConfig: IStatConfig;
}

export interface IConfigurations {
  costs: ICostConfig;
  sheepGeneration: ISheepGenerationConfig;
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
    maxRoll: 1000,
    rarityConfig: [
      { rarity: ERarity.Legendary, minRoll: 990 },
      { rarity: ERarity.Epic, minRoll: 900 },
      { rarity: ERarity.Rare, minRoll: 750 },
      { rarity: ERarity.Uncommon, minRoll: 400 },
      { rarity: ERarity.Common, minRoll: 0 },
    ],
    statConfig: {
      minStatTotal: 500,
      maxStatTotal: 2500,
    },
  },
};
