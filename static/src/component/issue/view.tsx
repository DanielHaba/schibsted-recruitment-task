import React from "react";
import { IIssue, IssueState } from "../../../../app/model/issue";
import { getAppContext, AppContext } from "../../context";



interface IssueViewProps {
    issue: IIssue;
    editable?: boolean;
}

interface IssueViewState {
    state?: IssueState;
    locked?: boolean;
}

export class IssueView extends React.Component<IssueViewProps, IssueViewState> {

    public static contextType = AppContext;
    
    public render() {
        if (this.props.issue) {
            const issue = this.props.issue;
            return (
                <div className="issue-view">
                    <div className="field">
                        <div className="label">Title</div>
                        <div className="value">{issue.title}</div>
                    </div>
                    <div className="field">
                        <div className="label">Description</div>
                        <div className="value">{issue.description}</div>
                    </div>
                    {this.renderStateList()}
                </div>
            );
        }
        return null;
    }

    private renderStateList() {
        if (this.isLocked()) {
            return;
        }
        if (!this.isEditable()) {
            return <div className="issue-state">{this.props.issue.state}</div>;
        }
        const opts = this.getAllowedStates().map((state, i) => (
            <option key={i} value={state}>{state}</option>
        ));
        const issueState = this.getIssueState();
        const isChanged = issueState !== this.props.issue.state;
        const submit = isChanged
            ? <button type="submit" onClick={this.updateIssueState.bind(this)}>Update</button>
            : null;

        return (
            <div>
                <select onChange={this.onIssueStateChange.bind(this)} value={issueState}>
                    {opts}
                </select>
                {submit}
            </div>
        );
    }

    private async updateIssueState(): Promise<void> {
        if (this.props.issue) {
            this.setState({ locked: true });
            const ctx = getAppContext(this);
            await ctx.issuePersistor.save({
                _id: this.props.issue._id,
                state: this.state.state,
            });
            this.setState({ locked: false });
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
        return [
            IssueState.Open,
            IssueState.Pending,
            IssueState.Closed,
        ];    
    }

    private isEditable(): boolean {
        return !!this.props.editable;
    }
}
