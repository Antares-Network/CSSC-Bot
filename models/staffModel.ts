import mongoose, { Schema } from "mongoose";

const STAFF = new Schema({
  id: String,
  NAME: String,
  ROLE_NAME: String,
  ROLE_ID: String,
});

const name = "staff";

export = mongoose.models[name] || mongoose.model(name, STAFF, name);
