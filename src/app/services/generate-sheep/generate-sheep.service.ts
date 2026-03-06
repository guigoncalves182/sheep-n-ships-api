import { Injectable } from '@nestjs/common';
import { ClientSession } from 'mongoose';
import { CONFIGURATIONS } from '../../../domain/constants/configurations.constants';
import { SheepRepository } from '../../../data/repositories/sheep/sheep.repository';
import { ERarity, IUserSheep } from '../../../domain/sheep.interface';

interface IGenerateSheepService {
  execute(userId: string, session?: ClientSession): Promise<IUserSheep>;
}

export const TOTAL_STATS = 6;
export const MAX_ROLL = 100;

@Injectable()
export class GenerateSheepService implements IGenerateSheepService {
  constructor(private readonly sheepRepository: SheepRepository) {}

  private rollRarity(roll: number): ERarity {
    for (const { rarity, minRoll } of CONFIGURATIONS.sheepGeneration
      .rarityConfig) {
      if (roll >= minRoll) return rarity;
    }
    return ERarity.Common;
  }

  private distributeStats(
    total: number,
    count: number,
    min: number,
    max: number,
    disparityRate: number,
  ): number[] {
    const remaining = total - count * min;
    const perMax = max - min;

    if (remaining === 0) {
      return Array.from({ length: count }, () => min);
    }

    const equalShare = remaining / count;
    const r = disparityRate / 100;
    const weights = Array.from({ length: count }, () => Math.random());
    const weightSum = weights.reduce((a, b) => a + b, 0);
    const randomShares =
      weightSum === 0
        ? Array.from({ length: count }, () => equalShare)
        : weights.map((w) => (w / weightSum) * remaining);

    const scaled: number[] = randomShares.map((rs) =>
      Math.min(Math.floor(equalShare + (rs - equalShare) * r), perMax),
    );

    let diff = remaining - scaled.reduce((a, b) => a + b, 0);
    for (let i = 0; diff > 0 && i < count; i++) {
      const remainingSlots = count - i;
      const add = Math.min(
        Math.ceil(diff / remainingSlots),
        perMax - scaled[i],
      );
      scaled[i] += add;
      diff -= add;
    }

    return scaled.map((s) => min + s);
  }

  async execute(userId: string, session?: ClientSession): Promise<IUserSheep> {
    const {
      minStatIndividual,
      maxStatIndividual,
      statDispersionRate: statDisparityRate,
    } = CONFIGURATIONS.sheepGeneration.statConfig;

    const minStatTotal = TOTAL_STATS * minStatIndividual;
    const maxStatTotal = TOTAL_STATS * maxStatIndividual;

    const roll = Math.floor(Math.random() * MAX_ROLL);

    const rarity = this.rollRarity(roll);

    const statTotal =
      minStatTotal +
      Math.floor((roll * (maxStatTotal - minStatTotal)) / (MAX_ROLL - 1));

    const [hitPoint, attack, defense, speed, evasion, accuracy] =
      this.distributeStats(
        statTotal,
        TOTAL_STATS,
        minStatIndividual,
        maxStatIndividual,
        statDisparityRate,
      );

    const sheep = await this.sheepRepository.createSheep(
      {
        userId,
        rarity,
        hitPoint,
        attack,
        defense,
        speed,
        evasion,
        accuracy,
      },
      session,
    );

    return sheep;
  }
}
