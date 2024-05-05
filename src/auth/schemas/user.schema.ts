import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ require: true })
  name: string;
  @Prop()
  lastName: string;
  @Prop()
  email: string;
  @Prop()
  password: string;
  @Prop({ default: Date.now })
  createDate: Date;
  @Prop({ default: Date.now })
  updateDate: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
