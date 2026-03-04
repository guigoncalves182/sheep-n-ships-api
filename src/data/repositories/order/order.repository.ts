import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import type { EOrderType, IUserOrder } from '../../../domain/order.interface';
import { Order } from '../../schemas/order.schema';

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

  async removeOrderById(
    orderId: string,
    session?: ClientSession,
  ): Promise<void> {
    await this.orderModel
      .findByIdAndDelete(orderId)
      .session(session ?? null)
      .exec();
  }

  async getOrderById(orderId: string): Promise<IUserOrder | null> {
    const order = await this.orderModel
      .findById(orderId)
      .lean<IUserOrder>()
      .exec();

    return order;
  }
}
