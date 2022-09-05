import mongoose, { Schema } from "mongoose";

export interface IYear {
  id: string;
  NAME: string;
  ROLE_NAME: string;
  ROLE_ID: string;
}

const YearSchema = new Schema({
  id: { type: String, required: true },
  NAME: { type: String, required: true },
  ROLE_NAME: { type: String, required: true },
  ROLE_ID: { type: String, required: true },
});

// export let yearModel = mongoose.model("year", YearSchema);
const name = "year";
export let yearModel = mongoose.model<IYear>(name, YearSchema, name);
