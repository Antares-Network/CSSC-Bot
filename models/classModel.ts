import mongoose, { Schema } from "mongoose";
import { IRole } from "../rolesOps";

export interface IClass extends IRole {
  id: string;
  CODE: string;
  TITLE: string;
  INFO: string;
  CHANNEL_NAME: string;
  CHANNEL_ID: string;
  UUID: string;
}

const ClassSchema = new Schema({
  id: { type: String },
  CODE: { type: String, required: true },
  TITLE: { type: String, required: true },
  INFO: { type: String, required: true },
  ROLE_NAME: { type: String, required: true },
  ROLE_ID: { type: String, required: true },
  CHANNEL_NAME: { type: String },
  CHANNEL_ID: { type: String },
  UUID: { type: String, default: "remove" },
});

const name = "class";

export const classModel = mongoose.model<IClass>(name, ClassSchema, name);
