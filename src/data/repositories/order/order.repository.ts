import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from 'src/data/schemas/order.schema';
import { IUserOrder } from 'src/domain/order.interface';

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
}
