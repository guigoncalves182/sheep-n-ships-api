import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export enum EOrderType {
  Sheep = 'Sheep',
  Ship = 'Ship',
}

@Schema({ collection: 'orders' })
export class Order {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true, enum: EOrderType })
  type: EOrderType;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: true })
  fulfilledAt: Date;
}

export const ORDER_SCHEMA = SchemaFactory.createForClass(Order);
