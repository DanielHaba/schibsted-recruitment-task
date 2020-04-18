import * as mongoose from "mongoose"

export enum IssueState {
    Pending = "pending",
    Open = "open",
    Closed = "closed",
}

export interface IIssue {
    id?: any
    title: string
    description: string
    state: IssueState
}

export interface IIssueRepository {
    getAllIssues(): Promise<IIssue[]>
}

export interface IIssuePersistor {
    saveIssue(issue: IIssue): Promise<void>
}

export const Issue = mongoose.model<IIssue & mongoose.Document>("issue")
