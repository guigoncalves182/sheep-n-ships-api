import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, Types } from 'mongoose';
import { DecodeTokenService } from '../../app/services/decode-token/decode-token.service';
import { OrderRepository } from '../../data/repositories/order/order.repository';
import { IUserSheep } from '../../domain/sheep.interface';
import { GenerateSheepService } from '../../app/services/generate-sheep/generate-sheep.service';

interface IClaimSheep {
  execute(token: string, orderId: string): Promise<IUserSheep>;
}

@Injectable()
export class ClaimSheep implements IClaimSheep {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly decodeTokenService: DecodeTokenService,
    private readonly orderRepository: OrderRepository,
    private readonly generateSheepService: GenerateSheepService,
  ) {}

  async execute(token: string, orderId: string): Promise<IUserSheep> {
    if (!Types.ObjectId.isValid(orderId))
      throw new BadRequestException('Invalid order id');

    const order = await this.orderRepository.getOrderById(orderId);
    if (!order) throw new BadRequestException('Order not found');

    const { id: userId } = await this.decodeTokenService.execute(token);
    if (order.userId !== userId)
      throw new BadRequestException('This order does not belong to the user');

    if (order.fulfilledAt > new Date())
      throw new BadRequestException('Order has not been fulfilled yet');

    const session = await this.connection.startSession();

    try {
      const sheep = await session.withTransaction(async () => {
        const [createdSheep] = await Promise.all([
          this.generateSheepService.execute(userId, session),
          this.orderRepository.removeOrderById(orderId, session),
        ]);

        return createdSheep;
      });

      return sheep;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(`Failed to claim sheep`);
    } finally {
      await session.endSession();
    }
  }
}
