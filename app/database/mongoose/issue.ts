import * as mongoose from "mongoose"
import { IIssue } from "../../model/issue"

export const IssueSchema = new mongoose.Schema({
    title: String,
    description: String,
    state: String,
});

export const Issue = mongoose.model<IIssue & mongoose.Document>("issue", IssueSchema);
