import mongoose, { Schema } from "mongoose";

const CLASS = new Schema({
  id: String,
  CODE: String,
  TITLE: String,
  INFO: String,
  ROLE_NAME: String,
  ROLE_ID: String,
  CHANNEL_NAME: String,
  CHANNEL_ID: String,
  UUID: String,
});

const name = "class";

export = mongoose.models[name] || mongoose.model(name, CLASS, name);
