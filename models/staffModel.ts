import mongoose, { Schema } from "mongoose";

export interface IStaff {
  id: string;
  NAME: string;
  ROLE_NAME: string;
  ROLE_ID: string;
}

const StaffSchema = new Schema({
  id: String,
  NAME: String,
  ROLE_NAME: String,
  ROLE_ID: String,
});

export let staffModel = mongoose.model("staff", StaffSchema);
