import mongoose, { Schema } from "mongoose";

export interface IStaff {
  id: string;
  NAME: string;
  ROLE_NAME: string;
  ROLE_ID: string;
}

const StaffSchema = new Schema({
  id: { type: String },
  NAME: { type: String, required: true },
  ROLE_NAME: { type: String, required: true },
  ROLE_ID: { type: String, required: true },
});

const name = "staff";

export const staffModel = mongoose.model<IStaff>(name, StaffSchema, name);
