import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<UserEmail>;

@Schema()
export class UserEmail {
  @Prop()
  email: string;
}

export const UserEmailSchema = SchemaFactory.createForClass(UserEmail);
