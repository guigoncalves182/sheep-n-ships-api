import { EOrderType } from '../data/schemas/order.schema';

export interface IUserOrder {
  userId: string;
  type: EOrderType;
  createdAt: Date;
  fulfilledAt: Date;
}
