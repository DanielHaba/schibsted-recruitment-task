import React from "react";
import { IIssue } from "../../../../app/model/issue";
import { getAppContext, AppContext } from "../../context";
import { IssueView } from "../../component/issue/view";
import { useParams } from "react-router-dom";

interface IssueViewWrapperProps {
    id: any;
}

interface IssueViewWrapperState {
    issue: IIssue|null;
}

class IssueViewWrapper extends React.Component<IssueViewWrapperProps, IssueViewWrapperState> {
    
    public static contextType = AppContext;

    public componentDidMount() {
        this.update();
    }

    public componentDidUpdate(prevProps: IssueViewWrapperProps) {
        if (this.props.id !== prevProps.id) {
            this.update();
        }
    }

    public render() {
        if (this.state) {
            if (!this.state.issue) {
                return <div>Issue does not exists</div>;
            }
            return (
                <section>
                    <h3>Issue #{this.props.id}</h3>
                    <main>
                        <IssueView issue={this.state.issue} editable={true} onUpdate={this.update.bind(this)} />
                    </main>
                </section>
            );
        }
        return <div>Loading</div>
    }

    private async update() {
        if (this.props.id) {
            const ctx = getAppContext(this);
            const issue = await ctx.issueRepository.getById(this.props.id);
            this.setState({ issue });
        } else {
            this.setState({ issue: null });
        }
    }
}


export function IssueViewPage() {
    const { id } = useParams();
    return <IssueViewWrapper id={id} />
}
