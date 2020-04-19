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
                <div className="field">
                    <label htmlFor="issue-title">Title</label>
                    <input id="issue-title" value={state.title} onChange={this.onTitleChange.bind(this)} />
                </div>
                <div className="field">
                    <label htmlFor="issue-description">Description</label>
                    <input id="issue-description" value={state.description} onChange={this.onDescriptionChange.bind(this)} />
                </div>
                <button type="submit" disabled={state.locked}>Submit</button>
            </form>
        );
    }

    private onTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ title: e.target.value });
    }

    private onDescriptionChange(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ description: e.target.value });
    }

    private onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        this.submit();
    }

    private async submit() {
        this.setState({ locked: true });
        const ctx = getAppContext(this);
        await ctx.issuePersistor.save(this.state);
        this.setState({ 
            title: "",
            description: "",
            locked: false 
        });
    }
}

