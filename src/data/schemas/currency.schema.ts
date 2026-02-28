import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'currencies' })
export class Currency {
  @Prop({ required: true, index: true })
  userId: string;

  @Prop({ required: true })
  chip: number;

  @Prop({ required: true })
  cash: number;
}

export const CURRENCY_SCHEMA = SchemaFactory.createForClass(Currency);
