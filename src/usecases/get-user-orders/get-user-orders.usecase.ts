import { Injectable } from '@nestjs/common';
import type { IUserOrder } from '../../domain/order.interface';
import { DecodeTokenService } from '../../app/services/decode-token/decode-token.service';
import { OrderRepository } from '../../data/repositories/order/order.repository';

interface IGetUserOrdersUseCase {
  execute(token: string): Promise<IUserOrder[]>;
}

@Injectable()
export class GetUserOrdersUseCase implements IGetUserOrdersUseCase {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly decodeTokenService: DecodeTokenService,
  ) {}

  async execute(token: string): Promise<IUserOrder[]> {
    const { id: userId } = await this.decodeTokenService.execute(token);
    return await this.orderRepository.getUserOrders(userId);
  }
}
