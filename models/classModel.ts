import mongoose, { Schema } from "mongoose";

export interface IClass {
  id: string;
  CODE: string;
  TITLE: string;
  INFO: string;
  ROLE_NAME: string;
  ROLE_ID: string;
  CHANNEL_NAME: string;
  CHANNEL_ID: string;
  UUID: string;
}

const ClassSchema = new Schema({
  id: String,
  CODE: String,
  TITLE: String,
  INFO: String,
  ROLE_NAME: String,
  ROLE_ID: String,
  CHANNEL_NAME: String,
  CHANNEL_ID: String,
  UUID: String,
});

export let classModel = mongoose.model<IClass>("class", ClassSchema);
