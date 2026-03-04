export enum EOrderType {
  Sheep = 'Sheep',
  Ship = 'Ship',
}

export interface IUserOrder {
  userId: string;
  type: EOrderType;
  createdAt: Date;
  fulfilledAt: Date;
}
