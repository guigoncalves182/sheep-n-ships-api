export enum ERarity {
  Common = 'Common',
  Uncommon = 'Uncommon',
  Rare = 'Rare',
  Epic = 'Epic',
  Legendary = 'Legendary',
}

export interface IUserSheep {
  rarity: ERarity;
  hitPoint: number;
  attack: number;
  defense: number;
  speed: number;
  evasion: number;
  accuracy: number;
  userId: string;
}
