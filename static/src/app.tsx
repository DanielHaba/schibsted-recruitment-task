import React from "react";
import {BrowserRouter as Router, Route } from  "react-router-dom";
import { IAppContext, AppContext } from "./context";
import { RestSource } from "./model/source";
import { IIssue } from "../../app/model/issue";
import { IssueIndexPage } from "./pages/issue";
import { IssueViewPage } from "./pages/issue/view";
import { IssueCreatePage } from "./pages/issue/create";
import { Navbar } from "./component/common/nav";


export class Application extends React.Component {

    private appCtx: IAppContext;

    public constructor(props: {}) {
        super(props);
        const issueSource = new RestSource<IIssue>("/api/issue");
        this.appCtx = {
            issuePersistor: issueSource,
            issueRepository: issueSource,
        };
    }

    public render() {
        return (
            <AppContext.Provider value={this.appCtx}>
                <Router>
                    <Navbar />
                    <br/>
                    <div className="container">
                        <Route exact path="/" component={IssueIndexPage} />
                        <Route exact path="/new-issue" component={IssueCreatePage} />
                        <Route path="/issue/:id" component={IssueViewPage} />
                    </div>
                </Router>
            </AppContext.Provider>
        );
    }
}