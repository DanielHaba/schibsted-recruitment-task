import React from "react";
import { Link } from "react-router-dom";
import { IIssue } from "../../../../app/model/issue";
import { IssueStateBadge } from "./state";

interface IssueListElementProps {
    issue: IIssue;
}

interface IssueListProps {
    issues: IIssue[]|undefined;
}


function IssueListElement(props: IssueListElementProps) {
    return (
        <Link className="list-group-item list-group-item-action" to={`/issue/${props.issue._id}`}>
            <span className="issue-title">
                <IssueStateBadge issue={props.issue} /> {props.issue.title}
            </span>
        </Link>
    );
}

export class IssueList extends React.Component<IssueListProps> {

    public render() {
        if (this.props && this.props.issues && this.props.issues.length) {
            const elems = this.props.issues.map(
                (v, i) => (<IssueListElement key={i} issue={v} />)
            );
            return (
                <div className="list-group">
                    {elems}
                </div>
            );
        }
        return <div>No Issues</div>
    }
}

