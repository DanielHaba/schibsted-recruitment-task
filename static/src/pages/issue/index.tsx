import React from "react";
import { getAppContext, AppContext } from "../../context";
import { IIssue } from "../../../../app/model/issue";
import { IssueList } from "../../component/issue/list";
import { Link } from "react-router-dom";

interface IssueIndexPageState {
    issues: IIssue[];
}

export class IssueIndexPage extends React.Component<{}, IssueIndexPageState> {

    public static contextType = AppContext;

    public componentDidMount() {
        this.update();
    }

    public render() {
        const issues = this.state ? this.state.issues : undefined;
        return (
            <section>
                <h3>Issues</h3>
                <Link to="/new-issue">Create issue</Link>
                <main>
                    <IssueList issues={issues} />
                </main>
            </section>
        )
    }

    private async update() {
        const ctx = getAppContext(this);
        const issues = await ctx.issueRepository.getAll();
        this.setState({ issues });
    }
}