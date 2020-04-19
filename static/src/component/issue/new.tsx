import React from "react";
import { IIssue } from "../../../../app/model/issue";
import { getAppContext, AppContext } from "../../context";


interface NewIssueState extends Omit<IIssue, "_id"> {
    locked: boolean;
}

export class NewIssue extends React.Component<{}, NewIssueState> {

    public static contextType = AppContext;
    
    public render() {
        const state = this.state || {};
        return (
            <form onSubmit={this.onSubmit.bind(this)}>
                <div className="form-group">
                    <label htmlFor="issue-title">Title</label>
                    <input id="issue-title" className="form-control" value={state.title} onChange={this.onTitleChange.bind(this)} />
                </div>
                <div className="form-group">
                    <label htmlFor="issue-description">Description</label>
                    <textarea id="issue-description" className="form-control" onChange={this.onDescriptionChange.bind(this)} value={state.description}/>
                </div>
                <button type="submit" className="btn btn-primary" disabled={state.locked}>Submit</button>
            </form>
        );
    }

    private onTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ title: e.target.value });
    }

    private onDescriptionChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        this.setState({ description: e.target.value });
    }

    private onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        this.submit();
    }

    private async submit() {
        this.setState({ locked: true });
        const ctx = getAppContext(this);
        try {
            await ctx.issuePersistor.save(this.state);
            this.setState({
                title: "",
                description: "",
            });
            alert("Issue created");
        } finally {
            this.setState({ locked: false });
        }
    }
}

