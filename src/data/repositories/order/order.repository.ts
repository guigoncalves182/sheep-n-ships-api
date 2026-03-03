import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EOrderType, Order } from '../../schemas/order.schema';
import type { IUserOrder } from '../../../domain/order.interface';

interface ICreateOrderParams {
  userId: string;
  type: EOrderType;
  fulfilledAt: Date;
}
@Injectable()
export class OrderRepository {
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<Order>,
  ) {}

  async getUserOrders(userId: string): Promise<IUserOrder[]> {
    const orders = await this.orderModel
      .find({ userId })
      .select({ _id: 1, userId: 1, type: 1, createdAt: 1, fulfilledAt: 1 })
      .lean<IUserOrder[]>()
      .exec();

    return orders;
  }

  async createOrder({
    userId,
    type,
    fulfilledAt,
  }: ICreateOrderParams): Promise<IUserOrder> {
    const order = await this.orderModel.create({
      userId,
      type,
      createdAt: new Date(),
      fulfilledAt,
    });

    return order;
  }
}
