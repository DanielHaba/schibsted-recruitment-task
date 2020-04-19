import React from "react";
import { Link } from "react-router-dom";
import { IIssue } from "../../../../app/model/issue";

interface IssueListElementProps {
    issue: IIssue;
}

interface IssueListProps {
    issues: IIssue[]|undefined;
}

function IssueListElement(props: IssueListElementProps) {
    return (
        <li className="issue-list-elem">
            <Link to={`/issue/${props.issue._id}`}>
                <span className="issue-title">
                    <span>[{props.issue.state}]</span> {props.issue.title}
                </span>
            </Link>
        </li>
    );
}

export class IssueList extends React.Component<IssueListProps> {

    public render() {
        if (this.props && this.props.issues && this.props.issues.length) {
            const elems = this.props.issues.map(
                (v, i) => (<IssueListElement key={i} issue={v} />)
            );
            return (
                <ol className="issue-list">
                    {elems}
                </ol>
            );
        }
        return <div>No Issues</div>
    }
}

