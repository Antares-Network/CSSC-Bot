import mongoose, { Schema } from "mongoose";
import { IRole } from "../rolesOps";

export interface IStaff extends IRole {
  id: string;
  NAME: string;
}

const StaffSchema = new Schema({
  id: { type: String },
  NAME: { type: String, required: true },
  ROLE_NAME: { type: String, required: true },
  ROLE_ID: { type: String, required: true },
});

const name = "staff";

export const staffModel = mongoose.model<IStaff>(name, StaffSchema, name);
