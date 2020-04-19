import React from "react";
import { IssueState, IIssue, getIssueAllowedStates } from "../../../../app/model/issue";
import { AppContext, getAppContext } from "../../context";

function IssueStateBadgeVariant(state: IssueState): string {
    switch (state) {
        case IssueState.Open:
            return "danger";
        case IssueState.Pending:
            return "warning";
        case IssueState.Closed:
            return "success";
        default:
            return "info";
    }
}

export function IssueStateBadge(props: {issue: IIssue}) {
    const classes = ["badge", "badge-" + IssueStateBadgeVariant(props.issue.state)];
    return <span className={classes.join(" ")}>{ props.issue.state }</span>
}

interface IssueStateChangerProps {
    issue: IIssue;
    onUpdate?: () => void;
}

interface IssueStateChangerState {
    state?: IssueState;
    locked?: boolean;
}

export class IssueStateChanger extends React.Component<IssueStateChangerProps, IssueStateChangerState> {

    public static contextType = AppContext;
    
    public render() {
        const opts = this.getAllowedStates().map((state, i) => (
            <option key={i} value={state}>{state}</option>
        ));
        const issueState = this.getIssueState();
        const isChanged = issueState !== this.props.issue.state;
        const isLocked = this.isLocked()
        const isDisabled = isLocked || !isChanged;

        return (
            <div className="input-group">
                <select onChange={this.onIssueStateChange.bind(this)} value={issueState} disabled={isLocked} className="form-control">
                    {opts}
                </select>
                <div className="input-group-append">
                    <button type="submit" 
                            className="btn btn-primary"
                            onClick={this.updateIssueState.bind(this)} 
                            disabled={isDisabled}>
                        Update
                    </button>
                </div>
            </div>
        );
    }

    private async updateIssueState(): Promise<void> {
        if (this.props.issue) {
            this.setState({ locked: true });
            const ctx = getAppContext(this);
            try {
                await ctx.issuePersistor.save({
                    _id: this.props.issue._id,
                    state: this.state.state,
                });
            } finally {
                this.setState({ locked: false });
            }
            if (this.props.onUpdate) {
                this.props.onUpdate();
            }
        }
    }

    private onIssueStateChange(e: React.ChangeEvent<HTMLSelectElement>) {
        this.setState({ state: e.target.value as IssueState });
    }

    private isLocked(): boolean {
        return this.state && !!this.state.locked;
    }

    private getIssueState(): IssueState {
        return (this.state ? this.state.state : undefined) || this.props.issue.state;
    }

    private getAllowedStates(): IssueState[] {
        return getIssueAllowedStates(this.props.issue.state);   
    }
}
