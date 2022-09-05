import mongoose, { Schema, model } from "mongoose";

export interface IStaff {
  id: string;
  NAME: string;
  ROLE_NAME: string;
  ROLE_ID: string;
}

const StaffSchema = new Schema({
  id: { type: String, required: true },
  NAME: { type: String, required: true },
  ROLE_NAME: { type: String, required: true },
  ROLE_ID: { type: String, required: true },
});

export let staffModel = model("staff", StaffSchema);
