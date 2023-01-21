import mongoose, { Schema } from "mongoose";
import { IRole } from "../utils/roles";

export interface IYear extends IRole {
  id: string;
  NAME: string;
}

const YearSchema = new Schema({
  id: { type: String },
  NAME: { type: String, required: true },
  ROLE_NAME: { type: String, required: true },
  ROLE_ID: { type: String, required: true },
});

const name = "year";
export const yearModel = mongoose.model<IYear>(name, YearSchema, name);
