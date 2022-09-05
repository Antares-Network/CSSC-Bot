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
  id: { type: String, required: true },
  CODE: { type: String, required: true },
  TITLE: { type: String, required: true },
  INFO: { type: String, required: true },
  ROLE_NAME: { type: String, required: true },
  ROLE_ID: { type: String, required: true },
  CHANNEL_NAME: { type: String, required: true },
  CHANNEL_ID: { type: String, required: true },
  UUID: { type: String, default: "remove" },
});

export let classModel = mongoose.model<IClass>("class", ClassSchema);
