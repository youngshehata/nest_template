import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ collection: 'errors' })
export class ErrorDocument {
  @Prop({ unique: true, required: true, index: true, type: String })
  uuid: string;

  @Prop({ required: true, type: String })
  message: string;

  @Prop({ required: true, type: String })
  ip: string;

  @Prop({ required: true, type: Date, default: Date.now })
  time: Date;

  @Prop({ required: true, type: String })
  path: string;

  @Prop({ required: true, type: String })
  method: string;

  @Prop({ required: true, type: String })
  stack: string;

  @Prop({ required: true, type: Boolean })
  isHttp: boolean;

  @Prop({ type: String, required: false }) // User will be JSON object
  user?: String;
}

export const ErrorSchema = SchemaFactory.createForClass(ErrorDocument);
