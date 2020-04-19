
export enum IssueState {
    Pending = "pending",
    Open = "open",
    Closed = "closed",
}

export interface IIssue {
    _id?: any;
    title: string;
    description: string;
    state: IssueState;
}

export interface IIssueRepository {
    getById(id: any): Promise<IIssue>;
    getAll(): Promise<IIssue[]>;
}

export interface IIssuePersistor {
    save(issue: Partial<IIssue>): Promise<void>;
}
