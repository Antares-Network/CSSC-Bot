import mongoose, { Schema } from "mongoose";

const YEAR = new Schema({
  id: String,
  NAME: String,
  ROLE_NAME: String,
  ROLE_ID: String,
});

const name = "year";

export = mongoose.models[name] || mongoose.model(name, YEAR, name);
