import mongoose, { Schema } from "mongoose";
import { IRole } from "../utils/roles";

export interface IClass extends IRole {
	id: string;
	NAME: string;
	TITLE: string;
	INFO: string;
	DUPE: boolean;
	ACTIVE: boolean;
	ROLE_NAME: string;
	ROLE_ID: string;
	CHANNEL_ID: string;
}

const ClassSchema = new Schema({
	id: { type: String },
	NAME: { type: String, required: true },
	TITLE: { type: String, required: true },
	INFO: { type: String, required: true },
	DUPE: { type: Boolean, required: false },
	ACTIVE: { type: Boolean, required: true },
	ROLE_NAME: { type: String, required: false },
	ROLE_ID: { type: String, required: false },
	CHANNEL_ID: { type: String, required: false },
});

const name = "class";

export const classModel = mongoose.model<IClass>(name, ClassSchema, name);
