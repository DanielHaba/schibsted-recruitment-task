import React from "react";
import { IIssue, IssueState } from "../../../../app/model/issue";
import { IssueStateChanger, IssueStateBadge } from "./state";

interface IssueViewProps {
    issue: IIssue;
    editable?: boolean;
    onUpdate?: () => void;
}

interface IssueViewState {
    state?: IssueState;
    locked?: boolean;
}

export class IssueView extends React.Component<IssueViewProps, IssueViewState> {
    
    public render() {
        if (this.props.issue) {
            const issue = this.props.issue;
            return (
                <div className="issue-view">
                    <div className="form-group">
                        <label htmlFor="issue-title">Title</label>
                        <input id="issue-title" readOnly className="form-control-plaintext" value={issue.title} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="issue-description">Description</label>
                        <textarea id="issue-description" readOnly className="form-control-plaintext" value={issue.description} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="issue-state">State</label>
                        <div id="issue-state">
                            {this.renderIssueState()}
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    }

    private renderIssueState() {
        if (this.isEditable()) {
            return <IssueStateChanger issue={this.props.issue} onUpdate={this.props.onUpdate} />
        }
        return <IssueStateBadge issue={this.props.issue} />;
    }
    
    private isEditable(): boolean {
        return !!this.props.editable;
    }
}
