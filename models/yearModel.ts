import mongoose, { Schema } from "mongoose";

export interface IYear {
  id: string;
  NAME: string;
  ROLE_NAME: string;
  ROLE_ID: string;
}

const YearSchema = new Schema({
  id: String,
  NAME: String,
  ROLE_NAME: String,
  ROLE_ID: String,
});

export let yearModel = mongoose.model("year", YearSchema);
