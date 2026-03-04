import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

enum ERarity {
  Common = 'Common', //gray
  Uncommon = 'Uncommon', //green
  Rare = 'Rare', //blue
  Epic = 'Epic', //purple
  Legendary = 'Legendary', //orange
}

@Schema({ collection: 'sheeps' })
export class Sheep {
  @Prop({ required: true, enum: ERarity })
  rarity: ERarity;

  @Prop({ required: true })
  hitPoint: number;

  @Prop({ required: true })
  attack: number;

  @Prop({ required: true })
  defense: number;

  @Prop({ required: true })
  speed: number;

  @Prop({ required: true })
  evasion: number;

  @Prop({ required: true })
  accuracy: number;

  @Prop({ required: true })
  userId: string;
}

export const SHEEP_SCHEMA = SchemaFactory.createForClass(Sheep);
