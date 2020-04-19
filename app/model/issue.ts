
export enum IssueState {
    Open = "open",
    Pending = "pending",
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

export function getIssueAllowedStates(state: IssueState): IssueState[] {
    switch (state) {
        case IssueState.Open:
            return [IssueState.Open, IssueState.Pending, IssueState.Closed];
        case IssueState.Pending:
            return [IssueState.Pending, IssueState.Closed];
        case IssueState.Closed:
            return [IssueState.Closed];
        default:
            return [];
    }
}

export function isIssueStateAllowed(prevState: IssueState, newState?: IssueState): boolean {
    return typeof(newState) !== "undefined" && getIssueAllowedStates(prevState).includes(newState);
}
